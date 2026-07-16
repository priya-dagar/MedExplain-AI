from typing import TypedDict
from sqlalchemy.orm import Session
from langgraph.graph import StateGraph, END
from app.ai.agents.supervisor import classify_intent
from app.ai.agents.symptom_agent import run_symptom_agent
from app.ai.agents.health_record_agent import run_health_record_agent



class AgentState(TypedDict):
    user_message: str
    intent: str
    response: str
    user_id: int
    db: Session
    history: list


def supervisor_node(state: AgentState) -> AgentState:
    intent = classify_intent(state["user_message"], state.get("history", []))
    return {**state, "intent": intent}


def symptom_node(state: AgentState) -> AgentState:
    reply = run_symptom_agent(
        state["user_message"], state["db"], state["user_id"], state.get("history", [])
    )
    return {**state, "response": reply}


def general_node(state: AgentState) -> AgentState:
    return {**state, "response": "I'm here to help with health-related questions. Could you tell me more about what you're experiencing?"}


def route_after_supervisor(state: AgentState) -> str:
    return "symptom" if state["intent"] == "symptom" else "general"


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("symptom", symptom_node)
    graph.add_node("general", general_node)
    graph.add_node("health_record", health_record_node)


    graph.set_entry_point("supervisor")
    
    graph.add_conditional_edges("supervisor", route_after_supervisor, {"symptom": "symptom", "health_record": "health_record", "general": "general"})

    graph.add_edge("symptom", END)
    graph.add_edge("general", END)
    graph.add_edge("health_record", END)

    return graph.compile()

def health_record_node(state: AgentState) -> AgentState:
    reply = run_health_record_agent(state["user_message"], state["db"], state["user_id"])
    return {**state, "response": reply}

def route_after_supervisor(state: AgentState) -> str:
    if state["intent"] == "symptom":
        return "symptom"
    if state["intent"] == "health_record":
        return "health_record"
    return "general"


compiled_graph = build_graph()