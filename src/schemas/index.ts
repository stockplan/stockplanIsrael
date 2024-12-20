import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ContactMessageSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .max(30, {
      message: "Email cannot exceed 30 characters",
    }),
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(12, {
      message: "First name cannot exceed 12 characters",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(12, {
      message: "Last name cannot exceed 12 characters",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(500, {
      message: "Description cannot exceed 4 lines or 500 characters",
    }),
});

export const lossCalcValidation = z
  .object({
    creator: z.string().optional(),
    ticker: z
      .string()
      .regex(/^[A-Z]*$/, "Ticker must be in uppercase letters only"),
    actualPrice: z.number().default(0),
    positionType: z.enum(["buy", "sell"]).default("buy"),
    quantity: z
      .number()
      .nonnegative("Quantity must be greater than 0")
      .int("Quantity must be an integer")
      .default(0),
    askPrice: z
      .number()
      .nonnegative("Ask Price must be greater than 0")
      .default(0),
    cost: z.number().nonnegative("Cost must be greater than 0").default(0),
    exitPrice: z
      .number()
      .nonnegative("Exit Price must be greater than 0")
      .default(0),
    expectedProfit: z.number().nonnegative().default(0),
    expectedProfitPercent: z
      .number()
      .nonnegative("Expected Profit Percent cannot be negative")
      .default(0),
    stopLoss: z
      .number()
      .nonnegative("Stop Loss must be greater than 0")
      .default(0),
    expectedLoss: z.number().default(0),
    expectedLossPercent: z
      .number()
      .min(-100, "Expected Loss Percent cannot be less than -100%")
      .default(0),
  })
  .superRefine((data, ctx) => {
    //? Cost must be equal to askPrice * quantity, but only if quantity and askPrice are greater than 0
    if (data.quantity > 0 && data.askPrice > 0) {
      if (data.cost !== data.askPrice * data.quantity) {
        ctx.addIssue({
          code: "custom",
          message: "Cost must be equal to askPrice multiplied by quantity",
          path: ["cost"],
        });
      }
    }

    //? Expected profit calculation based on positionType, but only if quantity and askPrice are greater than 0
    if (data.quantity > 0 && data.askPrice > 0 && data.exitPrice > 0) {
      const expectedProfit =
        data.positionType === "buy"
          ? (data.exitPrice - data.askPrice) * data.quantity
          : (data.askPrice - data.exitPrice) * data.quantity * -1;

      console.log(data.expectedProfit, expectedProfit);

      if (data.expectedProfit !== expectedProfit) {
        ctx.addIssue({
          code: "custom",
          message: "Expected profit calculation is incorrect",
          path: ["expectedProfit"],
        });
      }
    }

    // Expected profit percent should match the calculation, but only if cost and expectedProfit are greater than 0
    if (data.cost > 0 && data.expectedProfit > 0) {
      const expectedProfitPercent = (data.expectedProfit / data.cost) * 100;

      if (data.expectedProfitPercent !== expectedProfitPercent) {
        ctx.addIssue({
          code: "custom",
          message:
            "Expected profit percent must be equal to expected profit divided by total cost times 100",
          path: ["expectedProfitPercent"],
        });
      }
    }

    // Recalculating Expected Profit and Exit Price if Expected Profit Percent is manually changed, but only if necessary fields are greater than 0
    if (
      data.cost > 0 &&
      data.expectedProfitPercent > 0 &&
      data.quantity > 0 &&
      data.askPrice > 0
    ) {
      const calculatedProfit = (data.expectedProfitPercent / 100) * data.cost;
      const calculatedExitPrice =
        data.positionType === "buy"
          ? calculatedProfit / data.quantity + data.askPrice
          : data.askPrice - calculatedProfit / data.quantity;

      if (
        data.expectedProfit !== calculatedProfit ||
        data.exitPrice !== calculatedExitPrice
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Expected Profit and Exit Price must be updated based on Expected Profit Percent",
          path: ["expectedProfitPercent"],
        });
      }
    }

    // Expected loss calculation based on positionType, but only if stopLoss is provided and quantity > 0
    if (data.stopLoss && data.quantity > 0 && data.askPrice > 0) {
      const expectedLoss =
        data.positionType === "buy"
          ? (data.stopLoss - data.askPrice) * data.quantity * -1
          : (data.askPrice - data.stopLoss) * data.quantity;

      if (data.expectedLoss !== expectedLoss) {
        ctx.addIssue({
          code: "custom",
          message: "Expected loss calculation is incorrect",
          path: ["expectedLoss"],
        });
      }
    }

    // Expected loss percent should match the calculation, but only if cost and expectedLoss are greater than 0
    if (data.cost > 0 && data.expectedLoss > 0) {
      const expectedLossPercent = (data.expectedLoss / data.cost) * 100;

      if (data.expectedLossPercent !== expectedLossPercent) {
        ctx.addIssue({
          code: "custom",
          message:
            "Expected loss percent must be equal to expected loss divided by total cost times 100",
          path: ["expectedLossPercent"],
        });
      }
    }

    // Stop loss calculation based on expected loss, but only if expectedLoss and quantity are greater than 0
    if (data.expectedLoss > 0 && data.quantity > 0 && data.askPrice > 0) {
      const stopLoss =
        data.positionType === "buy"
          ? data.askPrice - data.expectedLoss / data.quantity
          : data.askPrice + data.expectedLoss / data.quantity;

      if (data.stopLoss !== stopLoss) {
        ctx.addIssue({
          code: "custom",
          message:
            "Stop Loss must be calculated based on expected loss and position type",
          path: ["stopLoss"],
        });
      }
    }
  });
