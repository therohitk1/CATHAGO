export const home = (req, res) => {
  res.render("index", {
    title: "Home | DocScan",
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user || null,
  });
};

export const dashboard = (req, res) => {
  res.render("user/dashboard", {
    title: "Dashboard | DocScan",
    activePage: 'dashboard',
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user,
  });
};

export const profile = (req, res) => {
  res.render("user/profile", {
    title: "Profile | DocScan",
    activePage: 'profile',
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user,
  });
};

export const docScan = (req, res) => {
  console.log("Session Docs Data:", req.session.docs);
  res.render("pages/docs-scan", {
    title: "Scan | DocScan",
    activePage: 'docs-scan',
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user,
    docs: req.session.docs || null, // Pass session docs explicitly
  });
};


export const scanHistory = (req, res) => {
  res.render("pages/scan-history", {
    title: "Scan History | DocScan",
    activePage: 'scan-history',
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user,
  });
};

export const settings = (req, res) => {
  res.render("user/settings", {
    title: "Settings | DocScan",
    activePage: 'settings',
    messages: req.flash(),
    url: req.originalUrl,
    user: req.session.user,
  });
};