export const validateSaudiPhone = (phone) => {
  if (!phone) return { isValid: false, message: "" };

  const trimmed = phone.trim().replace(/\s+/g, "");
  
  if (/[^\d+]/.test(trimmed)) {
    return { isValid: false, message: "Only numbers and '+' are allowed" };
  }

  const regex = /^(05\d{8}|9665\d{8}|\+9665\d{8})$/;
  
  if (!regex.test(trimmed)) {
    if (trimmed.length < 10) {
      return { isValid: false, message: "Number is too short" };
    }
    if (trimmed.length > 13) {
      return { isValid: false, message: "Number is too long" };
    }
    return { isValid: false, message: "Must start with 05, 9665, or +9665" };
  }

  return { isValid: true, message: "" };
};

export const normalizeSaudiPhone = (phone) => {
  if (!phone) return "";
  const trimmed = phone.trim().replace(/\s+/g, "");
  if (trimmed.startsWith("05")) {
    return "+966" + trimmed.slice(1);
  }
  if (trimmed.startsWith("9665")) {
    return "+" + trimmed;
  }
  return trimmed;
};

export const formatSaudiPhone = (phone) => {
  // Bonus: format as typing if desired, wait let's just do basic formatting
  // e.g., +966 5X XXX XXXX
  const numeric = phone.replace(/[^\d+]/g, "");
  let formatted = numeric;
  if (numeric.startsWith("+966") && numeric.length > 4) {
    formatted = "+966 " + numeric.slice(4, 6) + " " + numeric.slice(6, 9) + " " + numeric.slice(9, 13);
  } else if (numeric.startsWith("966") && numeric.length > 3) {
    formatted = "966 " + numeric.slice(3, 5) + " " + numeric.slice(5, 8) + " " + numeric.slice(8, 12);
  } else if (numeric.startsWith("05") && numeric.length > 2) {
    formatted = "05" + numeric.slice(2, 3) + " " + numeric.slice(3, 6) + " " + numeric.slice(6, 10);
  }
  return formatted.trim();
};

export const validateICCID = (iccid) => {
  if (!iccid) return { isValid: false, message: "" };

  const trimmed = iccid.trim().replace(/\s+/g, "");
  
  if (/[^\d]/.test(trimmed)) {
    return { isValid: false, message: "ICCID must contain only numbers" };
  }

  if (!trimmed.startsWith("89")) {
    return { isValid: false, message: "ICCID must start with 89" };
  }

  const regex = /^89\d{17,18}$/;
  if (!regex.test(trimmed)) {
    if (trimmed.length < 19) {
      return { isValid: false, message: "ICCID is too short (requires 19-20 digits)" };
    }
    if (trimmed.length > 20) {
      return { isValid: false, message: "ICCID is too long (maximum 20 digits)" };
    }
  }

  return { isValid: true, message: "" };
};
