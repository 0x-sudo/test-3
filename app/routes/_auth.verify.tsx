import { InputOTP, InputOTPGroup, InputOTPSlot } from "#app/components/ui/input-otp.js";
import { Form } from "@remix-run/react";

export default function VerifyRoute() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-4xl font-extrabold">Verify Route</h1>
      <Form>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Form>
    </div>
  )
}
