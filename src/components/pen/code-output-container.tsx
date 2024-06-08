import useCodeStore from "@/hooks/useCodeStore";

const spinnerTemplate = `
<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
<style>
html, body {
  width: 100%;
  height: 100%;
}
.lds-ring {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid currentColor;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
`;

export default function CodeOutputContainer() {
  const { manager } = useCodeStore();

  return (
    <div className="grid grid-rows-1 grid-cols-1 flex-grow relative">
      <iframe
        srcDoc={manager.pending ? spinnerTemplate : undefined}
        className="bg-white w-full h-full"
        title="Dev Preview"
        src={manager.pending ? undefined : manager.devUrl}
        referrerPolicy="no-referrer"
      />
      {/* <Console /> */}
    </div>
  );
}
