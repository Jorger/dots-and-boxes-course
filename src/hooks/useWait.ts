import { delay } from "../utils/delay";
import { useEffect } from "react";

/**
 * Hook that makes an interruption...
 * @param runEffect
 * @param waitTime
 * @param cb
 */
export const useWait = (
  runEffect = false,
  waitTime: number,
  cb: () => void
) => {
  useEffect(() => {
    const runAsync = async () => {
      /**
       * Wait for the specified time
       */
      await delay(waitTime);
      /**
       * The callback is executed...
       */
      cb();
    };

    /**
     * If an interrupt is indicated, the function is executed...
     */
    if (runEffect) {
      runAsync();
    }
  }, [runEffect, waitTime, cb]);
};
