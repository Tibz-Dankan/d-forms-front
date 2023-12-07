import React, { Fragment } from "react";
import { FormLayout } from "../../layout/FormLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  showCardNotification,
  hideCardNotification,
} from "../../store/actions/notification";
import { useDispatch } from "react-redux";
import { Input, Button } from "@material-tailwind/react";

export const Section1: React.FC = () => {
  const dispatch: any = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      locationAddress: "",
      country: "",
      email: "",
      telephone: "",
      accessNumber: "",
      referralNumber: "",
      age: "",
      sex: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Patient's name is required"),
      locationAddress: Yup.string().max(255).required("Location is required"),
      country: Yup.string().max(255).required("Country is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        //    dispatch form values to the global store
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });
  const formHasErrors = () => {
    let hasError = false;
    if (
      formik.errors.name ||
      formik.errors.email ||
      formik.errors.telephone ||
      formik.errors.password ||
      !formik.values.name ||
      !formik.values.email ||
      !formik.values.telephone ||
      !formik.values.password
    ) {
      dispatch(
        showCardNotification({
          type: "error",
          message: "Please check form for errors",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
      hasError = true;
    }
    return hasError;
  };

  const nextActionHandler = () => {
    if (formHasErrors()) return;
    // setShowBasicInfo(() => false), progressPercentageHandler(50), stepHandler(2);
  };

  return (
    <Fragment>
      <div className="full grid place-items-center h-auto">
        <FormLayout
          header={
            "EMPLOYMENT APPLICATION FOR LOCALLY EMPLOYED STAFF OR FAMILY MEMBER"
          }
          section="section 1"
          footer="Employment footer"
        >
          <form className="bg-green-500s w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <div className="relative space-y-1 pt-5">
                {formik.errors.name && formik.touched.name && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.name}
                  </p>
                )}
                <Input
                  crossOrigin={""}
                  type="text"
                  label="Name"
                  size="lg"
                  required
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>
              <div className="relative space-y-1 pt-5">
                {formik.errors.email && formik.touched.email && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
                <Input
                  crossOrigin={""}
                  type="email"
                  label="Email"
                  size="lg"
                  id="email"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              <div className="relative space-y-1 pt-5">
                {formik.errors.telephone && formik.touched.telephone && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.telephone}
                  </p>
                )}
                <Input
                  crossOrigin={""}
                  type="text"
                  label="Phone number"
                  size="lg"
                  required
                  id="telephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.telephone}
                />
              </div>
              <div className="relative space-y-1 pt-5">
                {formik.errors.password && formik.touched.password && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
                <Input
                  crossOrigin={""}
                  type="password"
                  label="Password"
                  size="lg"
                  required
                  id="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
            </div>
            <div className="mt-8">
              <Button
                variant="gradient"
                type="submit"
                fullWidth
                onClick={() => nextActionHandler()}
                disabled={false}
              >
                Next
              </Button>
            </div>
          </form>
        </FormLayout>
      </div>
    </Fragment>
  );
};
