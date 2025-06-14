import { toast } from 'react-toastify';

// Configuration for toasts (optional, but good for consistency)
const toastConfig = {
  position: "top-right",
  autoClose: 5000, // 5 seconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored", // "light", "dark", "colored"
};

export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};

export const showInfoToast = (message) => {
  toast.info(message, toastConfig);
};

export const showWarningToast = (message) => {
  toast.warning(message, toastConfig);
};

// You can also create a default toast if needed
// export const showToast = (message, type = 'default') => {
//   toast(message, { ...toastConfig, type });
// };
