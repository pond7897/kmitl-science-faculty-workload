import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AlertOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useAlert() {
  const { t } = useTranslation();

  return {
    /**
     * แสดง Success Alert
     */
    success: (options: AlertOptions) => {
      const { title, description, duration } = options;
      toast.success(title || t("Alert.successTitle"), {
        description: description || t("Alert.successDescription"),
        duration: duration || 4000,
      });
    },

    /**
     * แสดง Error Alert
     */
    error: (options: AlertOptions) => {
      const { title, description, duration } = options;
      toast.error(title || t("Alert.errorTitle"), {
        description: description || t("Alert.errorDescription"),
        duration: duration || 4000,
      });
    },

    /**
     * แสดง Warning Alert
     */
    warning: (options: AlertOptions) => {
      const { title, description, duration } = options;
      toast.warning(title || t("Alert.warningTitle"), {
        description: description || t("Alert.warningDescription"),
        duration: duration || 4000,
      });
    },

    /**
     * แสดง Info Alert
     */
    info: (options: AlertOptions) => {
      const { title, description, duration } = options;
      toast.info(title || t("Alert.infoTitle"), {
        description: description || t("Alert.infoDescription"),
        duration: duration || 4000,
      });
    },

    /**
     * แสดง Loading Alert
     */
    loading: (options: AlertOptions) => {
      const { title, description } = options;
      return toast.loading(title || t("Alert.loadingTitle"), {
        description: description || t("Alert.loadingDescription"),
      });
    },

    /**
     * อัปเดต toast message
     */
    update: (toastId: string | number, options: AlertOptions) => {
      const { title, description, duration } = options;
      toast.success(title || "", {
        id: toastId,
        description,
        duration: duration || 4000,
      });
    },

    /**
     * ปิด toast message
     */
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
  };
}
