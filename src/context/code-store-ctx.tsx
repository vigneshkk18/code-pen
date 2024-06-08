import { PropsWithChildren, createContext, useEffect, useState } from "react";

import { useParams } from "wouter";
import { WebContainer } from "@webcontainer/api";

import { transformPenToFileSystemTree } from "@/utils/code";
import { getPenDB } from "@/db";

interface WebContainerState {
  instance: WebContainer | null;
  ready: boolean;
  error: string;
}

interface CodeManagerState {
  error: string;
  devUrl: string;
  syncing: boolean;
  fileMounted: boolean;
  pending: boolean;
}

interface CodeStore {
  container: WebContainerState;
  manager: CodeManagerState;
  setPending: (pending: boolean) => void;
  addDep: (name: string) => Promise<void>;
}

const defaultContainer: WebContainerState = {
  instance: null,
  ready: false,
  error: "",
};

const defaultManager: CodeManagerState = {
  error: "",
  devUrl: "",
  fileMounted: false,
  syncing: false,
  pending: true,
};

export const CodeStore = createContext<CodeStore>({
  container: defaultContainer,
  manager: defaultManager,
  setPending() {},
  async addDep() {},
});

const penDB = getPenDB();

export default function CodeStoreCtx({ children }: PropsWithChildren) {
  const { penId } = useParams<{ penId: string }>();
  const [manager, setManager] = useState(defaultManager);
  const [container, setContainer] = useState(defaultContainer);

  useEffect(() => {
    let instance: WebContainer | null = null;
    const fn = async function () {
      if (container.ready && container.instance) return;
      const updatedContainer = { ...container };
      try {
        updatedContainer.instance = await WebContainer.boot();
        instance = updatedContainer.instance;
        updatedContainer.ready = true;
      } catch (error) {
        // @ts-expect-error any is not allowed
        updatedContainer.error = error.message;
      } finally {
        setContainer(updatedContainer);
      }
    };

    const timer = setTimeout(fn, 0);
    return () => {
      clearTimeout(timer);
      instance?.teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!container.ready || !container.instance) return;
    const fn = async function () {
      const updatedManager = { ...manager };
      try {
        const pens = await penDB.query((data) => data.id === penId);
        if (!pens || !pens.length) throw new Error("Pen Not Found!!!");
        const pen = pens[0];

        if (!container.instance) throw new Error("Instance Not Found!!!");
        container.instance.on("server-ready", (_, url) => {
          setManager((prev) => ({ ...prev, serverStarted: true, devUrl: url }));
        });
        container.instance.on("error", console.log);

        await container.instance.mount(transformPenToFileSystemTree(pen));
        const packages = pen.extensionEnabled.script?.packages || ["vite"];
        const p1 = await container.instance.spawn("npm", ["i", ...packages]);
        p1.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          })
        );
        await p1.exit;
        const p2 = await container.instance.spawn("npm", ["run", "dev"]);
        p2.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          })
        );
        await p2.exit;

        updatedManager.fileMounted = true;
        updatedManager.pending = false;
      } catch (error) {
        // @ts-expect-error any
        updatedManager.error = error.message;
        console.log(error);
      } finally {
        setManager(updatedManager);
      }
    };
    const timer = setTimeout(fn, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, penId]);

  const setPending = (pending: boolean) => {
    setManager((prev) => ({ ...prev, pending }));
  };

  const addDep = async (name: string) => {
    if (!container.instance) return;
    setManager((prev) => ({ ...prev, pending: true }));
    const p1 = await container.instance.spawn("npm", ["i", name]);
    p1.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    await p1.exit;
    setManager((prev) => ({ ...prev, pending: false }));
  };

  return (
    <CodeStore.Provider value={{ container, manager, setPending, addDep }}>
      {children}
    </CodeStore.Provider>
  );
}
