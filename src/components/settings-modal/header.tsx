import Button from "@/components/ui/button";
import { useSettingsModal } from "@/context/settings-modal-ctx";

export default function Header() {
  const { closeModal } = useSettingsModal();

  return (
    <header className="m-4 pb-2 flex justify-between items-center border-b-2 border-b-[#2c303a] relative after:absolute after:-bottom-[2px] after:h-[2px] after:w-32 after:bg-[#47cf73]">
      <h2 className="text-xl font-bold">Pen Settings</h2>
      <Button onClick={closeModal} className="!px-1 !py-[2px]">
        <i className="bx bx-x text-xl"></i>
      </Button>
    </header>
  );
}
