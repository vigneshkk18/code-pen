import Button from "@/components/ui/button";

import { useSettingsModal } from "@/context/settings-modal-ctx";

export default function Actions() {
  const { closeModal } = useSettingsModal();

  return (
    <div className="flex w-full justify-end bg-[#252830] p-4">
      <Button onClick={closeModal} variant="primary">
        Close
      </Button>
    </div>
  );
}
