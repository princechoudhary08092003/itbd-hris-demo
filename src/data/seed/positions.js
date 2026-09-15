export const positions = [
  { position_id: "POS-CEO", seat_title: "Chief Executive Officer", org_unit_id: "OU-EXEC", reports_to_position_id: null, position_status: "filled" },

  { position_id: "POS-VP-DELIVERY", seat_title: "VP, Client Delivery", org_unit_id: "OU-DELIVERY", reports_to_position_id: "POS-CEO", position_status: "filled" },
  { position_id: "POS-DM-NA", seat_title: "Delivery Manager – NA", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-VP-DELIVERY", position_status: "filled" },
  { position_id: "POS-DM-EU", seat_title: "Delivery Manager – EMEA", org_unit_id: "OU-DELIVERY-EU", reports_to_position_id: "POS-VP-DELIVERY", position_status: "filled" },
  { position_id: "POS-EL-NA-1", seat_title: "Engagement Lead", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-DM-NA", position_status: "filled" },
  { position_id: "POS-EL-NA-2", seat_title: "Engagement Lead", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-DM-NA", position_status: "filled" },
  { position_id: "POS-CC-NA-1", seat_title: "Client Coordinator", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-EL-NA-1", position_status: "filled" },
  { position_id: "POS-CC-NA-2", seat_title: "Client Coordinator", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-EL-NA-1", position_status: "open" },
  { position_id: "POS-EL-EU-1", seat_title: "Engagement Lead", org_unit_id: "OU-DELIVERY-EU", reports_to_position_id: "POS-DM-EU", position_status: "filled" },
  { position_id: "POS-EL-EU-2", seat_title: "Engagement Lead", org_unit_id: "OU-DELIVERY-EU", reports_to_position_id: "POS-DM-EU", position_status: "open" },

  { position_id: "POS-VP-ENG", seat_title: "VP, Engineering", org_unit_id: "OU-ENG", reports_to_position_id: "POS-CEO", position_status: "filled" },
  { position_id: "POS-PLAT-LEAD", seat_title: "Platform Engineering Lead", org_unit_id: "OU-ENG-PLATFORM", reports_to_position_id: "POS-VP-ENG", position_status: "filled" },
  { position_id: "POS-PLAT-ENG-1", seat_title: "Platform Engineer", org_unit_id: "OU-ENG-PLATFORM", reports_to_position_id: "POS-PLAT-LEAD", position_status: "filled" },
  { position_id: "POS-SUP-LEAD", seat_title: "Technical Support Lead", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-VP-ENG", position_status: "filled" },
  { position_id: "POS-SUP-ENG-1", seat_title: "Support Engineer", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-SUP-LEAD", position_status: "filled" },
  { position_id: "POS-SUP-ENG-2", seat_title: "Support Engineer", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-SUP-LEAD", position_status: "filled" },
  { position_id: "POS-SUP-ENG-3", seat_title: "Support Engineer (Night)", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-SUP-LEAD", position_status: "filled" },
  { position_id: "POS-SUP-ENG-4", seat_title: "Support Engineer", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-SUP-LEAD", position_status: "filled" },
  { position_id: "POS-SUP-ENG-BENCH", seat_title: "Support Engineer", org_unit_id: "OU-ENG-SUPPORT", reports_to_position_id: "POS-SUP-LEAD", position_status: "bench" },

  { position_id: "POS-HR-DIR", seat_title: "Director, People & HR", org_unit_id: "OU-HR", reports_to_position_id: "POS-CEO", position_status: "filled" },
  { position_id: "POS-HR-ADMIN", seat_title: "HR Admin", org_unit_id: "OU-HR", reports_to_position_id: "POS-HR-DIR", position_status: "filled" },
  { position_id: "POS-HR-COORD", seat_title: "HR Coordinator", org_unit_id: "OU-HR", reports_to_position_id: "POS-HR-DIR", position_status: "filled" },
  { position_id: "POS-RECRUITER", seat_title: "Recruiter", org_unit_id: "OU-HR", reports_to_position_id: "POS-HR-DIR", position_status: "open" },

  { position_id: "POS-FIN-DIR", seat_title: "Director, Finance & Ops", org_unit_id: "OU-FIN", reports_to_position_id: "POS-CEO", position_status: "filled" },
  { position_id: "POS-PAYROLL", seat_title: "Payroll Specialist", org_unit_id: "OU-FIN", reports_to_position_id: "POS-FIN-DIR", position_status: "filled" },

  { position_id: "POS-SALES-DIR", seat_title: "Director, Sales & Marketing", org_unit_id: "OU-SALES", reports_to_position_id: "POS-CEO", position_status: "filled" },
  { position_id: "POS-AE-1", seat_title: "Account Executive", org_unit_id: "OU-SALES", reports_to_position_id: "POS-SALES-DIR", position_status: "filled" },
  { position_id: "POS-VENDOR-1", seat_title: "Vendor – Delivery Support", org_unit_id: "OU-DELIVERY-NA", reports_to_position_id: "POS-DM-NA", position_status: "filled" },
];
