export default {
    ToNumber (anyValue) {
        return Number(isNaN(anyValue) ? 0 : Number(anyValue))
    }
  }
