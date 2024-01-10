export default function inputValidator(state, action) {
  if (action.type == "success") {
    return {
      ...state,
      checking: false,
      [action.name]: {
        color: "green",
        message: action.message,
        isValid: true,
      },
    }
  } else if (action.type === "error") {
    return {
      ...state,
      checking: false,
      [action.name]: {
        color: "red",
        message: action.message,
        isValid: false,
      },
      isFormValid: false,
    }
  } else if (action.type === "checking") {
    return {
      ...state,
      checking: true,
    }
  } else if (action.type === "formSuccess") {
    return {
      ...state,
      checking: false,
      isFormValid: true,
    }
  } else if (action.type === "reset") {
    return action.state
  }
}
