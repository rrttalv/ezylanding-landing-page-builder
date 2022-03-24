//Different errors from server redirects based on query parameters
export const billingErrorTypes = {
  noCustomer: "No stripe customer found, please contact support",
  noSub: "Could not find subscription, please contact support",
  failedSubUpdate: "Could not update subscription, please contact support",
  paymentProcessing: "Your payment is still being processed reload this page in a few mintues",
  paymentFailed: "Failed to process payment",
  unknown: "An unknown error occured on our side, please contact support"
}