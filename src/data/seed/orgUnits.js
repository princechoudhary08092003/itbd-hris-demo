export const orgUnits = [
  { org_unit_id: "OU-EXEC", name: "Executive", parent_org_unit_id: null },
  { org_unit_id: "OU-DELIVERY", name: "Client Delivery", parent_org_unit_id: "OU-EXEC" },
  { org_unit_id: "OU-DELIVERY-NA", name: "Delivery – North America", parent_org_unit_id: "OU-DELIVERY" },
  { org_unit_id: "OU-DELIVERY-EU", name: "Delivery – EMEA", parent_org_unit_id: "OU-DELIVERY" },
  { org_unit_id: "OU-ENG", name: "Engineering", parent_org_unit_id: "OU-EXEC" },
  { org_unit_id: "OU-ENG-PLATFORM", name: "Platform Engineering", parent_org_unit_id: "OU-ENG" },
  { org_unit_id: "OU-ENG-SUPPORT", name: "Technical Support", parent_org_unit_id: "OU-ENG" },
  { org_unit_id: "OU-HR", name: "People & HR", parent_org_unit_id: "OU-EXEC" },
  { org_unit_id: "OU-FIN", name: "Finance & Ops", parent_org_unit_id: "OU-EXEC" },
  { org_unit_id: "OU-SALES", name: "Sales & Marketing", parent_org_unit_id: "OU-EXEC" },
];
