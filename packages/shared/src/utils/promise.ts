export type BatchPromiseInput<T> = Array<() => Promise<T>>;

/**
 * Run promises in parallel with a variable batch size.
 *
 * @category Promise
 * @param promises Array of promises to run in parallel
 * @param batchSize Number of promises to run concurrently
 * @param ignoreErrors Whether to ignore errors and continue running promises even if some fail
 * @returns Promise that resolves when all promises are settled
 */
export async function runPromisesInBatchSequentially<T>(
  promises: BatchPromiseInput<T>,
  batchSize: number,
  ignoreErrors = false
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (promise) => {
        return promise()
          .then((result) => results.push(result))
          .catch((error) => {
            if (ignoreErrors) {
              return null;
            }

            throw error;
          });
      })
    );
  }

  return results;
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
