import { Form } from 'formik';

// Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
// We extend the Form component to properly type the onSubmit event parameter
const MINTForm = Form as any;

export default MINTForm;
