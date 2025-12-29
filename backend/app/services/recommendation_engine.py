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
                if res.data:
                    context.append(f"Department emissions: {res.data[0].get('total_co2e_kg', 0):.2f} kg CO2e")
                    
            elif branch_id:
                # Get branch-level emissions
                res = supabase.rpc('get_branch_emissions', {'p_branch_id': branch_id}).execute()
                if res.data:
                    context.append(f"Branch emissions: {res.data[0].get('total_co2e_kg', 0):.2f} kg CO2e")
                    
            elif org_id:
                # Get organization-level emissions
                res = supabase.rpc('get_org_emissions', {'p_org_id': org_id}).execute()
                if res.data:
                    context.append(f"Organization emissions: {res.data[0].get('total_co2e_kg', 0):.2f} kg CO2e")
            
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
            "Please provide 5-7 specific, actionable recommendations to reduce carbon emissions. "
            "Focus on practical, measurable actions that could be implemented. "
            "Format the response with clear bullet points, each starting with a verb. "
            "Be specific to the context provided."
        )
        
        try:
            # Call Groq API
            completion = self.client.chat.completions.create(
                model="moonshotai/kimi-k2-instruct-0905",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful sustainability assistant that provides specific, actionable recommendations for reducing carbon emissions."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000,
                top_p=1,
                stream=False
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return "We're currently unable to generate recommendations. Please try again later."
