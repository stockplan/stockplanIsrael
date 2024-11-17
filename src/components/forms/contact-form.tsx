import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMessageSchema } from "@/schemas";
import { useTransition } from "react";
import { sendEmailToAdmin } from "@/actions/admin";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const ContactForm = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const form = useForm<z.infer<typeof ContactMessageSchema>>({
    resolver: zodResolver(ContactMessageSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      description: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof ContactMessageSchema>) => {
    startTransition(() => {
      sendEmailToAdmin(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
          }
          if (data?.success) {
            form.reset();
            onSubmitSuccess();
          }
        })
        .catch(() => alert("Something went wrong"));
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("grid gap-3 p-2")}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="firstName" className="text-sm sm:text-base">
          First Name
        </Label>
        <Input
          {...form.register("firstName", { required: true })}
          id="firstName"
          name="firstName"
          inputMode="text"
          placeholder="Enter your first name"
          maxLength={12}
          className="p-2 text-sm bg-white"
        />
        {form.formState.errors.firstName && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lastName" className="text-sm sm:text-base">
          Last Name
        </Label>
        <Input
          {...form.register("lastName", { required: true })}
          id="lastName"
          name="lastName"
          inputMode="text"
          placeholder="Enter your last name"
          maxLength={12}
          className="p-2 text-sm bg-white"
        />
        {form.formState.errors.lastName && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.lastName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          {...form.register("email", { required: true })}
          id="email"
          name="email"
          inputMode="email"
          type="email"
          placeholder="Enter your email"
          maxLength={30}
          required
          className="p-2 text-sm bg-white"
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm sm:text-base">
          Description
        </Label>
        <textarea
          {...form.register("description", { required: true })}
          id="description"
          name="description"
          rows={4}
          placeholder="Write your description"
          maxLength={500}
          required
          className="bg-white p-2 text-sm border border-input bg-transparent shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.description && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <Button type="submit" className="mt-4" disabled={isPending}>
        Send
      </Button>
    </form>
  );
};

export default ContactForm;
