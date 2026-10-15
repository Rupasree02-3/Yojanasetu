from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date
import random

# Fixed local module imports
from database import get_db
from models import SchemeModel, ApplicationModel
from schemas import FilterCriteria, ApplicationCreate, ApplicationResponse, ActionVerification

router = APIRouter(prefix="/api")

def seed_initial_schemes(db: Session):
    if db.query(SchemeModel).count() == 0:
        initial_schemes = [
            SchemeModel(id="ap-rtf", title="Jagananna Vidya Deevena (RTF)", level="State", state="Andhra Pradesh", occupation="Student", ageGroup="18-25", incomeLimit=250000, allowsZeroIncome=True, category="Education", description="Complete college tuition fee reimbursement credited directly to mothers' bank accounts for polytechnic, ITI, degree, and engineering students in Andhra Pradesh."),
            SchemeModel(id="ap-mtf", title="Jagananna Vasathi Deevena (MTF)", level="State", state="Andhra Pradesh", occupation="Student", ageGroup="18-25", incomeLimit=250000, allowsZeroIncome=True, category="Education", description="Annual maintenance assistance of up to ₹20,000 for food and hostel expenses for higher education students residing in Andhra Pradesh."),
            SchemeModel(id="ap-rythu", title="YSR Rythu Bharosa - PM Kisan", level="State", state="Andhra Pradesh", occupation="Farmer", ageGroup="25-60", incomeLimit=300000, allowsZeroIncome=False, category="Agriculture", description="Direct input financial assistance of ₹13,500 per year per farmer family (including tenant farmers & SC/ST/BC/Minority landless cultivators)."),
            SchemeModel(id="ap-cheyutha", title="YSR Cheyutha Scheme", level="State", state="Andhra Pradesh", occupation="Women Self-Employed", ageGroup="25-60", incomeLimit=250000, allowsZeroIncome=True, category="Women", description="Financial assistance of ₹18,750 per year (₹75,000 over 4 years) to women aged 45-60 from backward communities to set up sustainable retail & dairy ventures."),
            SchemeModel(id="central-prematric", title="National Pre-Matric School Scholarship", level="Central", state="Central", occupation="Student", ageGroup="below18", incomeLimit=200000, allowsZeroIncome=True, category="Education", description="Financial scholarship and school kit allowance for children and minority/SC/ST students studying in classes 1 to 10 across all Indian states."),
            SchemeModel(id="central-postmatric", title="PM Higher Education Merit Scholarship", level="Central", state="Central", occupation="Student", ageGroup="18-25", incomeLimit=250000, allowsZeroIncome=True, category="Education", description="Merit-based university award for zero-income and economically weaker students pursuing graduate and postgraduate professional programs."),
            SchemeModel(id="pm-kisan", title="PM Kisan Samman Nidhi", level="Central", state="Central", occupation="Farmer", ageGroup="25-60", incomeLimit=300000, allowsZeroIncome=False, category="Agriculture", description="Central DBT transfer of ₹6,000 annually in three equal installments to all landholding farmer families across India."),
            SchemeModel(id="maha-yuva", title="Maharashtra Yuva Karya Prashikshan", level="State", state="Maharashtra", occupation="Unemployed", ageGroup="18-25", incomeLimit=150000, allowsZeroIncome=True, category="Employment", description="Monthly stipend up to ₹10,000 with 6-month industrial internship training for unemployed diploma and degree holders.")
        ]
        db.add_all(initial_schemes)
        
        initial_apps = [
            ApplicationModel(id="AP-2026-801", applicantName="K. Sai Srinivas", schemeName="Jagananna Vidya Deevena (RTF)", state="Andhra Pradesh", district="Visakhapatnam", mobile="9848022331", aadhaarMasked="XXXX XXXX 4102", incomeDeclared="₹0 (No Income)", date="2026-10-14", status="Approved", remarks="Income certificate verified by Visakhapatnam Revenue Desk."),
            ApplicationModel(id="AP-2026-802", applicantName="Ch. Lakshmi Devi", schemeName="YSR Cheyutha Scheme", state="Andhra Pradesh", district="Guntur", mobile="9440188229", aadhaarMasked="XXXX XXXX 9981", incomeDeclared="₹75,000", date="2026-10-15", status="Pending", remarks="SHG group linkage and Aadhaar biometric match pending.")
        ]
        db.add_all(initial_apps)
        db.commit()

@router.post("/schemes/filter")
def filter_schemes(criteria: FilterCriteria, db: Session = Depends(get_db)):
    seed_initial_schemes(db)
    query = db.query(SchemeModel)

    if criteria.search:
        search_kw = f"%{criteria.search.lower()}%"
        query = query.filter((SchemeModel.title.ilike(search_kw)) | (SchemeModel.description.ilike(search_kw)))

    if criteria.state:
        if criteria.state == "Central":
            query = query.filter(SchemeModel.level == "Central")
        else:
            query = query.filter((SchemeModel.state == criteria.state) | (SchemeModel.level == "Central"))

    if criteria.ageGroup:
        query = query.filter(SchemeModel.ageGroup == criteria.ageGroup)

    if criteria.occupation:
        query = query.filter(SchemeModel.occupation == criteria.occupation)

    if criteria.income != "" and criteria.income is not None:
        try:
            income_val = int(criteria.income)
            if income_val == 0:
                query = query.filter(SchemeModel.allowsZeroIncome == True)
            else:
                query = query.filter((SchemeModel.incomeLimit >= income_val) | (SchemeModel.allowsZeroIncome == True))
        except ValueError:
            pass

    return query.all()

@router.get("/applications", response_model=List[ApplicationResponse])
def get_applications(district: Optional[str] = "All", db: Session = Depends(get_db)):
    seed_initial_schemes(db)
    if district == "All":
        return db.query(ApplicationModel).order_by(ApplicationModel.date.desc()).all()
    return db.query(ApplicationModel).filter(ApplicationModel.district == district).order_by(ApplicationModel.date.desc()).all()

@router.post("/applications", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    target_scheme = db.query(SchemeModel).filter(SchemeModel.id == payload.schemeId).first()
    if not target_scheme:
        raise HTTPException(status_code=404, detail="Target scheme not found.")

    app_id = f"APP-2026-{random.randint(1000, 9999)}"
    masked_uid = f"XXXX XXXX {payload.aadhaar[-4:]}"

    new_app = ApplicationModel(
        id=app_id,
        applicantName=payload.applicantName,
        schemeName=target_scheme.title,
        state=target_scheme.state,
        district=payload.district,
        mobile=payload.mobile,
        aadhaarMasked=masked_uid,
        incomeDeclared=payload.incomeDeclared,
        date=str(date.today()),
        status="Pending",
        remarks=f"Submitted to {payload.district} District Scrutiny Desk."
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.patch("/applications/{app_id}/verify", response_model=ApplicationResponse)
def verify_application(app_id: str, action: ActionVerification, db: Session = Depends(get_db)):
    application = db.query(ApplicationModel).filter(ApplicationModel.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application missing.")

    application.status = "Approved" if action.decision == "Approved" else "Rejected"
    application.remarks = (
        "Scrutiny cleared and approved by District Magistrate Officer."
        if action.decision == "Approved"
        else "Application rejected due to income documentation mismatch."
    )

    db.commit()
    db.refresh(application)
    return application
