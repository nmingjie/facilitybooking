import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
// export const taskSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   status: z.string(),
//   label: z.string(),
//   priority: z.string(),
// })

// export type Task = z.infer<typeof taskSchema>


export const bookingSchema = z.object({
  id: z.number(),
  building_name: z.string(),
  facility_name: z.string(),
  booking_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  status: z.string(),

})

export type Booking = z.infer<typeof bookingSchema>