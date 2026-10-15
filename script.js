/* ========================================================
   YOJANASETU PORTAL JAVASCRIPT ENGINE
   ======================================================== */

// 1. SCHEMES DATABASE (PAN-INDIA, CENTRAL & ANDHRA PRADESH)
const schemesDatabase = [
  {
    id: "ap-rtf",
    title: "Jagananna Vidya Deevena (RTF)",
    level: "State",
    state: "Andhra Pradesh",
    occupation: "Student",
    ageGroup: "18-25",
    incomeLimit: 250000,
    allowsZeroIncome: true,
    category: "Education",
    description: "Complete college tuition fee reimbursement credited directly to mothers' bank accounts for polytechnic, ITI, degree, and engineering students in Andhra Pradesh."
  },
  {
    id: "ap-mtf",
    title: "Jagananna Vasathi Deevena (MTF)",
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
    description: "Direct input financial assistance of ₹13,500 per year per farmer family (including tenant farmers & SC/ST/BC/Minority landless cultivators)."
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
    description: "Financial assistance of ₹18,750 per year (₹75,000 over 4 years) to women aged 45-60 from backward communities to set up sustainable retail & dairy ventures."
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
    description: "Financial scholarship and school kit allowance for children and minority/SC/ST students studying in classes 1 to 10 across all Indian states."
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
    description: "Central DBT transfer of ₹6,000 annually in three equal installments to all landholding farmer families across India."
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
    schemeName: "Jagananna Vidya Deevena (RTF)",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    mobile: "9848022331",
    aadhaarMasked: "XXXX XXXX 4102",
    incomeDeclared: "₹0 (No Income)",
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
    aadhaarMasked: "XXXX XXXX 9981",
    incomeDeclared: "₹75,000",
    date: "2026-10-15",
    status: "Pending",
    remarks: "SHG group linkage and Aadhaar biometric match pending."
  },
  {
    id: "UP-2026-441",
    applicantName: "Amit Verma",
    schemeName: "PM Higher Education Merit Scholarship",
    state: "Uttar Pradesh",
    district: "Lucknow",
    mobile: "9120033441",
    aadhaarMasked: "XXXX XXXX 2331",
    incomeDeclared: "₹0 (Student)",
    date: "2026-10-15",
    status: "Pending",
    remarks: "College enrollment confirmation awaited."
  }
];

// Active User Session State
let currentUserSession = null;
let activeSchemeForApply = null;

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  renderSchemesGrid(schemesDatabase, "homeSchemesGrid");
  renderSchemesGrid(schemesDatabase, "allSchemesGrid");
  renderCitizenApplications();
  renderOfficialTable();
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
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.remove("active-panel");
  });
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active-panel");

  if (triggerBtn) {
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    triggerBtn.classList.add("active");
  }

  // Close mobile sidebar on navigation
  if (window.innerWidth <= 1024) {
    document.getElementById("appRoot").classList.remove("sidebar-open");
  }
}

// Protected Views Check
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

// 6. AUTHENTICATION (SIGN IN & LOGOUT)
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
    aadhaarMasked: "XXXX XXXX " + aadhaar.slice(-4),
    name: role === "official" ? "Officer (" + email.split("@")[0] + ")" : email.split("@")[0],
    role: role
  };

  // Switch UI Elements
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
    container.innerHTML = `
      <div style="grid-column: span 2; padding: 30px; text-align: center; color: #64748b;">
        No government schemes match your criteria. Try loosening filters.
      </div>
    `;
    return;
  }

  container.innerHTML = schemes.map(s => `
    <div class="scheme-card">
      <div>
        <div class="scheme-badge-row">
          <span class="level-tag ${s.level === 'Central' ? 'level-central' : 'level-state'}">
            ${s.level} Level • ${s.state}
          </span>
        </div>
        <h4>${s.title}</h4>
        <p>${s.description}</p>
      </div>
      <div class="scheme-card-footer">
        <span class="zero-income-eligible-tag">
          ${s.allowsZeroIncome ? '✓ Zero-Income Eligible' : 'Eligibility Rules Apply'}
        </span>
        <button class="btn-apply-card" onclick="openApplyModal('${s.id}')">Apply Online</button>
      </div>
    </div>
  `).join("");
}

// 8. 6-FILTER MATCHING ENGINE
function runFilter() {
  const searchVal = document.getElementById("globalSearchInput").value.toLowerCase();
  const stateVal = document.getElementById("filterState").value;
  const ageVal = document.getElementById("filterAge").value;
  const occVal = document.getElementById("filterOccupation").value;
  const incomeVal = document.getElementById("filterIncome").value;

  const results = schemesDatabase.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchVal) || s.description.toLowerCase().includes(searchVal);
    const matchState = !stateVal || s.state === stateVal || (stateVal !== "Central" && s.level === "Central");
    const matchAge = !ageVal || s.ageGroup === ageVal;
    const matchOcc = !occVal || s.occupation === occVal;

    let matchIncome = true;
    if (incomeVal !== "") {
      const incNum = parseInt(incomeVal, 10);
      if (incNum === 0) {
        matchIncome = s.allowsZeroIncome === true;
      } else {
        matchIncome = s.incomeLimit <= incNum || s.allowsZeroIncome === true;
      }
    }

    return matchSearch && matchState && matchAge && matchOcc && matchIncome;
  });

  document.getElementById("resultsCountTag").innerText = `Showing ${results.length} Eligible Scheme(s)`;
  renderSchemesGrid(results, "homeSchemesGrid");
  renderSchemesGrid(results, "allSchemesGrid");
}

function resetFilters() {
  document.getElementById("globalSearchInput").value = "";
  document.getElementById("filterState").value = "";
  document.getElementById("filterAge").value = "";
  document.getElementById("filterOccupation").value = "";
  document.getElementById("filterIncome").value = "";
  document.getElementById("filterAadhaar").value = "";
  document.getElementById("filterMobile").value = "";
  document.getElementById("aadhaarStatusIndicator").innerText = "Optional e-KYC";
  document.getElementById("aadhaarStatusIndicator").classList.remove("valid");
  runFilter();
}

function filterByCategory(category) {
  switchView("schemesView", document.getElementById("btnNavSchemes"));
  const matched = schemesDatabase.filter(s => s.category === category);
  renderSchemesGrid(matched, "allSchemesGrid");
}

// 9. APPLICATION SUBMISSION (MODAL)
function openApplyModal(schemeId) {
  if (!currentUserSession) {
    alert("Please sign in from the left sidebar to apply for any government scheme.");
    return;
  }
  const scheme = schemesDatabase.find(s => s.id === schemeId);
  if (!scheme) return;

  activeSchemeForApply = scheme;
  document.getElementById("modalSchemeTitle").innerText = "Apply for: " + scheme.title;
  document.getElementById("appFullName").value = currentUserSession.name;
  document.getElementById("applyModal").style.display = "flex";
}

function closeApplyModal() {
  document.getElementById("applyModal").style.display = "none";
}

function submitCitizenApplication() {
  const name = document.getElementById("appFullName").value.trim();
  const mobile = document.getElementById("appMobileNumber").value.trim();
  const aadhaar = document.getElementById("appAadhaarNumber").value.replace(/\s/g, "");
  const district = document.getElementById("appDistrictSelect").value;
  const income = document.getElementById("appIncomeBracket").value;

  if (!name || mobile.length !== 10 || aadhaar.length !== 12) {
    alert("Please provide a valid Full Name, 10-digit Mobile, and 12-digit Aadhaar number.");
    return;
  }

  const newApp = {
    id: "APP-2026-" + Math.floor(1000 + Math.random() * 9000),
    applicantName: name,
    schemeName: activeSchemeForApply.title,
    state: activeSchemeForApply.state,
    district: district,
    mobile: mobile,
    aadhaarMasked: "XXXX XXXX " + aadhaar.slice(-4),
    incomeDeclared: income === "0" ? "₹0 (No Income)" : "₹" + Number(income).toLocaleString("en-IN"),
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    remarks: "Submitted to " + district + " District Scrutiny Desk."
  };

  applicationsDatabase.unshift(newApp);
  closeApplyModal();
  renderCitizenApplications();
  renderOfficialTable();
  alert("Application (" + newApp.id + ") filed successfully. You can track its progress under 'My Applications'.");
  switchView("myAppsView", document.getElementById("btnNavMyApps"));
}

// 10. CITIZEN TRACKING TABLE
function renderCitizenApplications() {
  const tbody = document.getElementById("citizenAppTableBody");
  if (!tbody) return;

  tbody.innerHTML = applicationsDatabase.map(app => `
    <tr>
      <td><b>${app.id}</b></td>
      <td>${app.schemeName}</td>
      <td>${app.district} (${app.state})</td>
      <td>${app.mobile}</td>
      <td>${app.date}</td>
      <td>
        <span class="status-badge ${app.status === 'Approved' ? 'status-approved' : app.status === 'Rejected' ? 'status-rejected' : 'status-pending'}">
          ${app.status}
        </span>
      </td>
      <td>${app.remarks}</td>
    </tr>
  `).join("");
}

// 11. DISTRICT VERIFICATION OFFICER DESK
function renderOfficialTable() {
  const tbody = document.getElementById("officialAppTableBody");
  const filterDistrict = document.getElementById("districtSelectFilter") 
    ? document.getElementById("districtSelectFilter").value 
    : "All";

  if (!tbody) return;

  const filtered = applicationsDatabase.filter(app => {
    return filterDistrict === "All" || app.district === filterDistrict;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 20px;">No applications found for ${filterDistrict}.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(app => `
    <tr>
      <td><b>${app.id}</b></td>
      <td>${app.applicantName}</td>
      <td>${app.schemeName}</td>
      <td>${app.district}</td>
      <td>${app.aadhaarMasked}<br><small>${app.mobile}</small></td>
      <td>${app.incomeDeclared}</td>
      <td>
        <span class="status-badge ${app.status === 'Approved' ? 'status-approved' : app.status === 'Rejected' ? 'status-rejected' : 'status-pending'}">
          ${app.status}
        </span>
      </td>
      <td>
        ${app.status === 'Pending' ? `
          <button class="btn-desk-action btn-approve" onclick="verifyApplication('\${app.id}', 'Approved')">Approve</button>
          <button class="btn-desk-action btn-reject" onclick="verifyApplication('\${app.id}', 'Reject')">Reject</button>
        ` : `<span style="font-size: 11px; color: #64748b;">Completed</span>`}
      </td>
    </tr>
  `).join("");
}

function verifyApplication(appId, decision) {
  const record = applicationsDatabase.find(a => a.id === appId);
  if (record) {
    record.status = decision;
    record.remarks = decision === "Approved" 
      ? "Scrutiny cleared and approved by District Magistrate Officer."
      : "Application rejected due to income documentation mismatch.";
    renderCitizenApplications();
    renderOfficialTable();
  }
}

// 12. GRIEVANCE TICKET SUBMISSION (HELP & SUPPORT)
function submitSupportGrievance() {
  const name = document.getElementById("helpName").value.trim();
  const mobile = document.getElementById("helpMobile").value.trim();
  const type = document.getElementById("helpIssueType").value;
  const desc = document.getElementById("helpDescription").value.trim();

  if (!name || mobile.length !== 10 || !desc) {
    alert("Please provide your Name, a valid 10-digit Mobile number, and a description of your issue.");
    return;
  }

  const ticketId = "TKT-2026-" + Math.floor(1000 + Math.random() * 9000);
  alert(`Grievance Ticket #${ticketId} submitted successfully!\n\nCategory: ${type}\nOur District Helpdesk will contact you at +91 ${mobile} within 24 hours.`);
  
  document.getElementById("helpName").value = "";
  document.getElementById("helpMobile").value = "";
  document.getElementById("helpDescription").value = "";
}