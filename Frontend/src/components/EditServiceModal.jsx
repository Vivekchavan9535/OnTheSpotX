import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateService, clearEditId } from "../slices/servicesSlice";
import serviceValidationSchema from "../validations/service-validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditServiceModal({ isOpen, onOpenChange }) {
  const dispatch = useDispatch();
  const { data, editId, loading, serverError } = useSelector(
    (state) => state.services
  );

  const serviceToEdit = data.find((service) => service._id === editId);

  const formik = useFormik({
    initialValues: {
      title: serviceToEdit?.title || "",
      description: serviceToEdit?.description || "",
      basePrice: serviceToEdit?.basePrice || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const { error } = serviceValidationSchema.validate(values, {
        abortEarly: false,
      });
      if (!error) return {};
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      if (!editId) return;
      await dispatch(updateService({ editId, formData: values, resetForm }));
    },
  });

  const handleOpenChange = (open) => {
    if (!open) {
      dispatch(clearEditId());
      formik.resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen && !!serviceToEdit} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[425px] md:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">
            Edit Service: {serviceToEdit?.title}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 pt-4 w-full"
        >
          <div>
            <Label htmlFor="title">Service Name</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Car Inspection"
              className="w-full"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Short description"
              className="w-full min-h-[100px]"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">{formik.errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              value={formik.values.basePrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="₹500"
              className="w-full"
            />
            {formik.touched.basePrice && formik.errors.basePrice && (
              <p className="text-red-500 text-sm">{formik.errors.basePrice}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-600 text-sm">{serverError}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(clearEditId())}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
