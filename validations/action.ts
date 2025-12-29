import { z } from "zod";

/**
 * Enforces: <resource>:<action>
 *
 * Resource:
 *  - lowercase letters
 *  - can include hyphens (e.g. truck-order, company-credit)
 *
 * Action:
 *  - lowercase letters only
 *
 * Valid examples:
 *  - invoice:add
 *  - order:pay
 *  - truck-order:accept
 *  - company-credit:receive
 */
export const actionFormSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-z]+(-[a-z]+)*:[a-z]+$/,
      'Action name must follow "<resource>:<action>" e.g. invoice:add or truck-order:accept'
    ),

  resource: z
    .string()
    .min(2, "Resource is required")
    .regex(
      /^[a-z]+(-[a-z]+)*$/,
      "Resource must be lowercase and may include hyphens"
    ),

  description: z.string().min(3, "Description is required"),
});
