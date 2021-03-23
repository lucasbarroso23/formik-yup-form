import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useState } from "react";
import { mixed, number, object } from "yup";

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: "",
            lastName: "",
            millionaire: false,
            money: 0,
            description: "",
          }}
          onSubmit={() => {}}
        >
          <FormikStep>
            <Field name="firstName" component={TextField} label="First Name" />
            <Field name="lastName" component={TextField} label="Last Name" />
            <Field
              name="millionaire"
              type="checkbox"
              component={CheckboxWithLabel}
              Label={{ label: "I am a millionaire" }}
            />
          </FormikStep>

          <FormikStep
            validationSchema={object({
              money: mixed().when("millionaire", {
                is: true,
                then: number()
                  .required()
                  .min(
                    1_000_000,
                    "Because you said you are a millionaire you need to have 1 million"
                  ),
                otherwise: number().required(),
              }),
            })}
          >
            <Field
              name="money"
              type="number"
              component={TextField}
              label="All the money I have"
            />
          </FormikStep>

          <FormikStep>
            <Field
              name="description"
              component={TextField}
              label="Description"
            />
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ElementType<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[
    step
  ] as React.ElementType<FormikStepProps>;
  console.log(currentChild);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
        } else {
          setStep((s) => s + 1);
        }
      }}
    >
      <Form autoComplete="off">
        {currentChild}
        {step > 0 && (
          <Button onClick={() => setStep((s) => s - 1)}>Back</Button>
        )}
        <Button type="submit">{isLastStep() ? "Submit" : "Next"}</Button>
      </Form>
    </Formik>
  );
}
