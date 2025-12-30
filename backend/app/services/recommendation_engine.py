from typing import Optional
from groq import Groq
import os
from app.database import supabase

class RecommendationEngine:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    def _get_emission_context(self, org_id: str = None, branch_id: str = None, dept_id: str = None, 
                           start_date: str = None, end_date: str = None) -> str:
        """
        Fetch emission data context for the AI to generate relevant recommendations
        """
        context = []
        
        try:
            if dept_id:
                # Get department-level emissions
                res = supabase.rpc('get_department_emissions', {'p_dept_id': dept_id}).execute()
                if res.data and len(res.data) > 0:
                    data = res.data[0]
                    val = data['total_co2e_kg'] if isinstance(data, dict) else getattr(data, 'total_co2e_kg', 0)
                    context.append(f"Department emissions: {val:.2f} kg CO2e")
                    
            elif branch_id:
                # Get branch-level emissions
                res = supabase.rpc('get_branch_emissions', {'p_branch_id': branch_id}).execute()
                if res.data and len(res.data) > 0:
                    data = res.data[0]
                    # Handle both dict and object/float cases just in case
                    if isinstance(data, (int, float)):
                        val = data
                    elif isinstance(data, dict):
                        val = data.get('total_co2e_kg', 0)
                    else:
                        val = 0
                    context.append(f"Branch emissions: {val:.2f} kg CO2e")
                    
            elif org_id:
                # Get organization-level emissions
                res = supabase.rpc('get_org_emissions', {'p_org_id': org_id}).execute()
                if res.data and len(res.data) > 0:
                    data = res.data[0]
                    if isinstance(data, (int, float)):
                        val = data
                    elif isinstance(data, dict):
                        val = data.get('total_co2e_kg', 0)
                    else:
                        val = 0
                    context.append(f"Organization emissions: {val:.2f} kg CO2e")
            
            # Add time period context if provided
            if start_date and end_date:
                context.append(f"Time period: {start_date} to {end_date}")
                
        except Exception as e:
            print(f"Error fetching emission context: {str(e)}")
            
        return "\n".join(context) if context else "No specific emission data available."
    
    def generate_recommendations(self, org_id: str = None, branch_id: str = None, dept_id: int = None,
                              start_date: str = None, end_date: str = None) -> str:
        """
        Generate AI-powered recommendations for reducing carbon emissions
        """
        # Get relevant emission context
        context = self._get_emission_context(org_id, branch_id, dept_id, start_date, end_date)
        
        # Determine the scope for the prompt
        scope = []
        if dept_id:
            scope.append("department")
        if branch_id:
            scope.append("branch")
        if org_id:
            scope.append("organization")
        
        scope_text = " ".join(scope) if scope else "general"
        
        # Create the prompt
        prompt = (
            "You are a sustainability expert providing specific, actionable recommendations to reduce carbon emissions. "
            f"Here's the current emission data for this {scope_text}:\n\n{context}\n\n"
            "Please provide 4-6 specific, actionable recommendations. "
            "Return the response ONLY as a valid JSON array of objects. "
            "Each object must have these exact keys: 'action' (string, title of action), 'description' (string, 1-2 sentence detail), "
            "'impact' (string, e.g. 'High', 'Medium'), 'difficulty' (string, 'Low', 'Medium', 'High'), 'cost_estimate' (string, e.g. '$500-1000'). "
            "Do not wrap the JSON in markdown code blocks. Just return the raw JSON string."
        )
        
        try:
            # Call Groq API
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant", # switching to a reliable json model
                messages=[
                    {
                        "role": "system",
                        "content": "You are a sustainability expert. You must output only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=1500,
                top_p=1,
                stream=False
            )
            
            content = completion.choices[0].message.content.strip()
            # Clean up potential markdown wrapping
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            import json
            try:
                recommendations = json.loads(content)
                # Ensure it's a list
                if isinstance(recommendations, dict):
                    recommendations = [recommendations]
                return recommendations
            except json.JSONDecodeError:
                print(f"Failed to parse JSON from AI: {content}")
                # Fallback
                return [{
                    "action": "Review Energy Usage",
                    "description": "We couldn't generate specific recommendations at this time, but reviewing your energy bills is always a good start.",
                    "impact": "Medium",
                    "difficulty": "Low"
                }]
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return [{
                "action": "Check System Connection",
                "description": "Unable to generate recommendations due to a system error.",
                "impact": "Low",
                "difficulty": "Low"
            }]
