from pydantic import BaseModel
from typing import Optional

class FilterCriteria(BaseModel):
    search: Optional[str] = None
    state: Optional[str] = None
    ageGroup: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[str] = None

class ApplicationCreate(BaseModel):
    schemeId: str
    applicantName: str
    district: str
    mobile: str
    aadhaar: str
    incomeDeclared: str

class ApplicationResponse(BaseModel):
    id: str
    applicantName: str
    schemeName: str
    state: str
    district: str
    mobile: str
    aadhaarMasked: str
    incomeDeclared: str
    date: str
    status: str
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

class ActionVerification(BaseModel):
    decision: str
