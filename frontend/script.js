/* ========================================================
   YOJANASETU PORTAL JAVASCRIPT ENGINE
   ======================================================== */

const API_BASE_URL = "https://yojanasetu-s3a5.onrender.com";

// 1. SCHEMES DATABASE (PAN-INDIA, CENTRAL & ANDHRA PRADESH)
const schemesDatabase = [
  {
    id: "ap-rtf",
    title: "Jagananna Vidya Deevena",
    level: "State",
    state: "Andhra Pradesh",
    occupation: "Student",
    ageGroup: "18-25",
    incomeLimit: 250000,
    allowsZeroIncome: true,
    category: "Education",
    description: "Complete college tuition fee reimbursement credited directly to mothers bank accounts for polytechnic, ITI, degree, and engineering students in Andhra Pradesh."
  },
  {
    id: "ap-mtf",
    title: "Jagananna Vasathi Deevena",
    level: "State",
    state: "Andhra Pradesh",
    occupation: "Student",
    ageGroup: "18-25",
    incomeLimit: 250000,
    allowsZeroIncome: true,
    category: "Education",
    description: "Annual maintenance assistance of up to ₹20,000 for food and hostel expenses for higher education students residing in Andhra Pradesh."
  },
  {
    id: "ap-rythu",
    title: "YSR Rythu Bharosa - PM Kisan",
    level: "State",
    state: "Andhra Pradesh",
    occupation: "Farmer",
    ageGroup: "25-60",
    incomeLimit: 300000,
    allowsZeroIncome: false,
    category: "Agriculture",
    description: "Direct input financial assistance of ₹13,500 per year per farmer family including tenant farmers and SC, ST, BC, Minority landless cultivators."
  },
  {
    id: "ap-cheyutha",
    title: "YSR Cheyutha Scheme",
    level: "State",
    state: "Andhra Pradesh",
    occupation: "Women Self-Employed",
    ageGroup: "25-60",
    incomeLimit: 250000,
    allowsZeroIncome: true,
    category: "Women",
    description: "Financial assistance of ₹18,750 per year for women aged 45-60 from backward communities to set up sustainable retail and dairy ventures."
  },
  {
    id: "central-prematric",
    title: "National Pre-Matric School Scholarship",
    level: "Central",
    state: "Central",
    occupation: "Student",
    ageGroup: "below18",
    incomeLimit: 200000,
    allowsZeroIncome: true,
    category: "Education",
    description: "Financial scholarship and school kit allowance for children and minority, SC, ST students studying in classes 1 to 10 across all Indian states."
  },
  {
    id: "central-postmatric",
    title: "PM Higher Education Merit Scholarship",
    level: "Central",
    state: "Central",
    occupation: "Student",
    ageGroup: "18-25",
    incomeLimit: 250000,
    allowsZeroIncome: true,
    category: "Education",
    description: "Merit-based university award for zero-income and economically weaker students pursuing graduate and postgraduate professional programs."
  },
  {
    id: "pm-kisan",
    title: "PM Kisan Samman Nidhi",
    level: "Central",
    state: "Central",
    occupation: "Farmer",
    ageGroup: "25-60",
    incomeLimit: 300000,
    allowsZeroIncome: false,
    category: "Agriculture",
    description: "Central direct benefit transfer of ₹6,000 annually in three equal installments to all landholding farmer families across India."
  },
  {
    id: "maha-yuva",
    title: "Maharashtra Yuva Karya Prashikshan",
    level: "State",
    state: "Maharashtra",
    occupation: "Unemployed",
    ageGroup: "18-25",
    incomeLimit: 150000,
    allowsZeroIncome: true,
    category: "Employment",
    description: "Monthly stipend up to ₹10,000 with 6-month industrial internship training for unemployed diploma and degree holders."
  }
];

// 2. APPLICATIONS REPOSITORY (MOCK DATABASE)
let applicationsDatabase = [
  {
    id: "AP-2026-801",
    applicantName: "K. Sai Srinivas",
    schemeName: "Jagananna Vidya Deevena",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    mobile: "9848022331",
    aadhaarMasked: "XXXX XXXX [Aadhaar Redacted]",
    incomeDeclared: "₹0 - No Income",
    date: "2026-10-14",
    status: "Approved",
    remarks: "Income certificate verified by Visakhapatnam Revenue Desk."
  },
  {
    id: "AP-2026-802",
    applicantName: "Ch. Lakshmi Devi",
    schemeName: "YSR Cheyutha Scheme",
    state: "Andhra Pradesh",
    district: "Guntur",
    mobile: "9440188229",
    aadhaarMasked: "XXXX XXXX [Aadhaar Redacted]",
    incomeDeclared: "₹75,000",
    date: "2026-10-15",
    status: "Pending",
    remarks: "SHG group linkage and biometric match pending."
  },
  {
    id: "UP-2026-441",
    applicantName: "Amit Verma",
    schemeName: "PM Higher Education Merit Scholarship",
    state: "Uttar Pradesh",
    district: "Lucknow",
    mobile: "9120033441",
    aadhaarMasked: "XXXX XXXX [Aadhaar Redacted]",
    incomeDeclared: "₹0 - Student",
    date: "2026-10-15",
    status: "Pending",
    remarks: "College enrollment confirmation awaited."
  }
];

let currentUserSession = null;
let activeSchemeForApply = null;

window.addEventListener("DOMContentLoaded", function() {
  runFilter();
  loadApplicationsFromDatabase();
});

// 3. COLLAPSIBLE SIDEBAR TOGGLING
function toggleSidebar() {
  const root = document.getElementById("appRoot");
  if (window.innerWidth <= 1024) {
    root.classList.toggle("sidebar-open");
  } else {
    root.classList.toggle("sidebar-collapsed");
  }
}

// 4. AADHAAR 4-DIGIT AUTO-SPACING FORMATTER
function formatAadhaarInput(element) {
  let val = element.value.replace(/\D/g, "");
  let formatted = "";
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += val[i];
  }
  element.value = formatted.substring(0, 14);
}

function validateAadhaarBadge(element) {
  const indicator = document.getElementById("aadhaarStatusIndicator");
  const raw = element.value.replace(/\s/g, "");
  if (raw.length === 12) {
    indicator.innerText = "✓ Valid 12-Digit UID";
    indicator.classList.add("valid");
  } else {
    indicator.innerText = "Optional e-KYC";
    indicator.classList.remove("valid");
  }
}

// 5. VIEW NAVIGATION LOGIC
function switchView(viewId, triggerBtn) {
  document.querySelectorAll(".view-panel").forEach(function(panel) {
    panel.classList.remove("active-panel");
  });
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active-panel");

  if (triggerBtn) {
    document.querySelectorAll(".nav-btn").forEach(function(btn) {
      btn.classList.remove("active");
    });
    triggerBtn.classList.add("active");
  }

  if (window.innerWidth <= 1024) {
    document.getElementById("appRoot").classList.remove("sidebar-open");
  }
}

function openProtectedView(viewId, triggerBtn) {
  if (!currentUserSession) {
    alert("Please sign in from the left sidebar to access this section.");
    return;
  }
  if (viewId === "officialDashView" && currentUserSession.role !== "official") {
    alert("Access Restricted: This dashboard is reserved for District Verification Officers.");
    return;
  }
  switchView(viewId, triggerBtn);
}

// 6. AUTHENTICATION
function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const aadhaar = document.getElementById("loginAadhaar").value.replace(/\s/g, "");
  const pass = document.getElementById("loginPassword").value.trim();
  const role = document.getElementById("loginRole").value;

  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }
  if (aadhaar.length !== 12) {
    alert("Please enter a valid 12-digit Aadhaar number.");
    return;
  }
  if (!pass) {
    alert("Please enter your password.");
    return;
  }

  currentUserSession = {
    email: email,
    aadhaarMasked: "XXXX XXXX [Aadhaar Redacted]",
    name: role === "official" ? "Officer " + email.split("@")[0] : email.split("@")[0],
    role: role
  };

  document.getElementById("sidebarLoginCard").style.display = "none";
  document.getElementById("userProfileArea").style.display = "flex";
  document.getElementById("displayUserName").innerText = currentUserSession.name;
  document.getElementById("displayUserRole").innerText = 
    role === "official" ? "District Verification Officer" : "Citizen Account";
  document.getElementById("displayUserAadhaar").innerText = "Aadhaar: " + currentUserSession.aadhaarMasked;

  if (role === "official") {
    document.getElementById("officialNavBtn").style.display = "flex";
    alert("Signed in as District Officer. Verification Desk activated.");
  } else {
    document.getElementById("officialNavBtn").style.display = "none";
    alert("Signed in successfully as Citizen.");
  }
}

function handleLogout() {
  currentUserSession = null;
  document.getElementById("sidebarLoginCard").style.display = "block";
  document.getElementById("userProfileArea").style.display = "none";
  document.getElementById("officialNavBtn").style.display = "none";
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginAadhaar").value = "";
  document.getElementById("loginPassword").value = "";
  switchView("homeView", document.getElementById("btnNavHome"));
  alert("Signed out successfully.");
}

// 7. RENDER SCHEMES CARDS
function renderSchemesGrid(schemes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (schemes.length === 0) {
    container.innerHTML = '<div style="grid-column: span 2; padding: 30px; text-align: center; color: #64748b;">No government schemes match your criteria. Try loosening filters.</div>';
    return;
  }

  container.innerHTML = schemes.map(function(s) {
    var levelClass = s.level === "Central" ? "level-central" : "level-state";
    var zeroIncomeText = s.allowsZeroIncome ? "✓ Zero-Income Eligible" : "Eligibility Rules Apply";
    
    return '<div class="scheme-card">' +
      '<div>' +
        '<div class="scheme-badge-row">' +
          '<span class="level-tag ' + levelClass + '">' + s.level + ' Level • ' + s.state + '</span>' +
        '</div>' +
        '<h4>' + s.title + '</h4>' +
        '<p>' + s.description + '</p>' +
      '</div>' +
      '<div class="scheme-card-footer">' +
        '<span class="zero-income-eligible-tag">' + zeroIncomeText + '</span>' +
        '<button class="btn-apply-card" onclick="openApplyModal(\'' + s.id + '\')">Apply Now</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

// 8. FILTER ENGINE
function runFilter() {
  const state = document.getElementById("filterState").value;
  const age = document.getElementById("filterAge").value;
  const occ = document.getElementById("filterOccupation").value;
  const inc = document.getElementById("filterIncome").value;
  const searchInput = document.getElementById("globalSearchInput");
  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = schemesDatabase.filter(function(s) {
    if (state && state !== "Central" && s.state !== state && s.level !== "Central") return false;
    if (state === "Central" && s.level !== "Central") return false;
    if (age && s.ageGroup !== age) return false;
    if (occ && s.occupation !== occ) return false;
    if (inc !== "") {
      const incNum = parseInt(inc);
      if (incNum === 0 && !s.allowsZeroIncome) return false;
      if (incNum > 0 && s.incomeLimit < incNum && !s.allowsZeroIncome) return false;
    }
    if (search && !s.title.toLowerCase().includes(search) && !s.description.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });

  const countTag = document.getElementById("resultsCountTag");
  if (countTag) countTag.innerText = "Showing " + filtered.length + " Schemes";
  renderSchemesGrid(filtered, "homeSchemesGrid");
  renderSchemesGrid(schemesDatabase, "allSchemesGrid");
}

function resetFilters() {
  document.getElementById("filterState").value = "";
  document.getElementById("filterAge").value = "";
  document.getElementById("filterOccupation").value = "";
  document.getElementById("filterIncome").value = "";
  document.getElementById("filterAadhaar").value = "";
  document.getElementById("filterMobile").value = "";
  const searchInput = document.getElementById("globalSearchInput");
  if (searchInput) searchInput.value = "";
  runFilter();
}

function filterByCategory(cat) {
  switchView("schemesView", document.getElementById("btnNavSchemes"));
  const filtered = schemesDatabase.filter(function(s) {
    return s.category === cat;
  });
  renderSchemesGrid(filtered, "allSchemesGrid");
}

// 9. MODAL & CITIZEN APPLICATION
function openApplyModal(schemeId) {
  if (!currentUserSession) {
    alert("Please sign in from the left panel before applying.");
    return;
  }
  activeSchemeForApply = schemesDatabase.find(function(s) { return s.id === schemeId; });
  if (!activeSchemeForApply) return;
  document.getElementById("modalSchemeTitle").innerText = "Apply: " + activeSchemeForApply.title;
  document.getElementById("applyModal").style.display = "flex";
}

function closeApplyModal() {
  document.getElementById("applyModal").style.display = "none";
}

async function submitCitizenApplication() {
  const name = document.getElementById("appFullName").value.trim();
  const mobile = document.getElementById("appMobileNumber").value.trim();
  const aadhaar = document.getElementById("appAadhaarNumber").value.replace(/\s/g, "");
  const district = document.getElementById("appDistrictSelect").value;
  const incSelect = document.getElementById("appIncomeBracket");
  const incomeText = incSelect.options[incSelect.selectedIndex].text;

  if (!name || mobile.length !== 10 || aadhaar.length !== 12) {
    alert("Please enter complete name, 10-digit mobile, and valid 12-digit Aadhaar number.");
    return;
  }

  const payload = {
    schemeId: activeSchemeForApply.id,
    applicantName: name,
    district: district,
    mobile: mobile,
    aadhaar: aadhaar,
    incomeDeclared: incomeText
  };

  try {
    const res = await fetch(API_BASE_URL + "/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("Application registered with state scrutiny desk successfully.");
      closeApplyModal();
      await loadApplicationsFromDatabase();
      return;
    }
  } catch (e) {
    console.warn("Backend API unreachable, storing application locally.");
  }

  const newLocalApp = {
    id: "APP-2026-" + Math.floor(1000 + Math.random() * 9000),
    applicantName: name,
    schemeName: activeSchemeForApply.title,
    state: activeSchemeForApply.state,
    district: district,
    mobile: mobile,
    aadhaarMasked: "XXXX XXXX [Aadhaar Redacted]",
    incomeDeclared: incomeText,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    remarks: "Submitted to " + district + " District Scrutiny Desk."
  };
  applicationsDatabase.unshift(newLocalApp);
  alert("Application submitted successfully. Reference ID: " + newLocalApp.id);
  closeApplyModal();
  renderCitizenApplications();
  renderOfficialTable();
}

// 10. APPLICATION RENDERING & SCRUTINY
async function loadApplicationsFromDatabase() {
  try {
    const res = await fetch(API_BASE_URL + "/api/applications");
    if (res.ok) {
      applicationsDatabase = await res.json();
    }
  } catch (e) {
    console.warn("Using offline mock application records.");
  }
  renderCitizenApplications();
  renderOfficialTable();
}

function renderCitizenApplications() {
  const tbody = document.getElementById("citizenAppTableBody");
  if (!tbody) return;
  tbody.innerHTML = applicationsDatabase.map(function(app) {
    var badgeClass = app.status === "Approved" ? "status-approved" : (app.status === "Pending" ? "status-pending" : "status-rejected");
    return '<tr>' +
      '<td><strong>' + app.id + '</strong></td>' +
      '<td>' + app.schemeName + '</td>' +
      '<td>' + app.district + ', ' + app.state + '</td>' +
      '<td>+91 ' + app.mobile + '</td>' +
      '<td>' + app.date + '</td>' +
      '<td><span class="status-badge ' + badgeClass + '">' + app.status + '</span></td>' +
      '<td>' + (app.remarks || "Under Review") + '</td>' +
    '</tr>';
  }).join("");
}

function renderOfficialTable() {
  const tbody = document.getElementById("officialAppTableBody");
  if (!tbody) return;
  const selDistrict = document.getElementById("districtSelectFilter") ? document.getElementById("districtSelectFilter").value : "All";
  const records = applicationsDatabase.filter(function(a) {
    return selDistrict === "All" || a.district === selDistrict;
  });

  tbody.innerHTML = records.map(function(app) {
    var badgeClass = app.status === "Approved" ? "status-approved" : (app.status === "Pending" ? "status-pending" : "status-rejected");
    return '<tr>' +
      '<td>' + app.id + '</td>' +
      '<td>' + app.applicantName + '</td>' +
      '<td>' + app.schemeName + '</td>' +
      '<td>' + app.district + '</td>' +
      '<td>' + app.aadhaarMasked + '<br><small>+91 ' + app.mobile + '</small></td>' +
      '<td>' + app.incomeDeclared + '</td>' +
      '<td><span class="status-badge ' + badgeClass + '">' + app.status + '</span></td>' +
      '<td>' +
        '<button class="btn-desk-action btn-approve" onclick="verifyDeskAction(\'' + app.id + '\', \'Approved\')">Approve</button>' +
        '<button class="btn-desk-action btn-reject" onclick="verifyDeskAction(\'' + app.id + '\', \'Rejected\')">Reject</button>' +
      '</td>' +
    '</tr>';
  }).join("");
}

// 11. VERIFICATION OFFICER ACTION
async function verifyDeskAction(appId, decision) {
  const decisionPayload = { decision: decision };
  try {
    const response = await fetch(API_BASE_URL + "/api/applications/" + appId + "/verify", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decisionPayload)
    });
    if (response.ok) {
      alert("Application status altered successfully to " + decision + ".");
      await loadApplicationsFromDatabase();
      return;
    }
  } catch (error) {
    console.error("API Error. Processing locally.", error);
  }
  const record = applicationsDatabase.find(function(a) { return a.id === appId; });
  if (record) {
    record.status = decision;
    record.remarks = decision === "Approved" ? "Scrutiny cleared and approved by District Magistrate Officer." : "Application rejected due to income documentation mismatch.";
    renderCitizenApplications();
    renderOfficialTable();
  }
}

// 12. GRIEVANCE TICKET SUBMISSION
function submitSupportGrievance() {
  const name = document.getElementById("helpName").value.trim();
  const mobile = document.getElementById("helpMobile").value.trim();
  const type = document.getElementById("helpIssueType").value;
  const desc = document.getElementById("helpDescription").value.trim();
  if (!name || mobile.length !== 10 || !desc) {
    alert("Please provide your Name, a valid 10-digit Mobile number, and a description of your issue.");
    return;
  }
  var ticketId = "TKT-2026-" + Math.floor(1000 + Math.random() * 9000);
  alert("Grievance Ticket #" + ticketId + " submitted successfully!\n\nCategory: " + type + "\nOur District Helpdesk will contact you at +91 " + mobile + " within 24 hours.");
  document.getElementById("helpName").value = "";
  document.getElementById("helpMobile").value = "";
  document.getElementById("helpDescription").value = "";
}
