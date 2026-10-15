from sqlalchemy import Column, String, Integer, Boolean
from database import Base  # Fixed local import

class SchemeModel(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    level = Column(String, nullable=False)
    state = Column(String, nullable=False)
    occupation = Column(String, nullable=False)
    ageGroup = Column(String, nullable=False)
    incomeLimit = Column(Integer, nullable=False)
    allowsZeroIncome = Column(Boolean, default=True)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)

class ApplicationModel(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    applicantName = Column(String, nullable=False)
    schemeName = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    aadhaarMasked = Column(String, nullable=False)
    incomeDeclared = Column(String, nullable=False)
    date = Column(String, nullable=False)
    status = Column(String, default="Pending")
    remarks = Column(String, nullable=True)
