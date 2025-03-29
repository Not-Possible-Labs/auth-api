FROM public.ecr.aws/docker/library/ubuntu:22.04
COPY --from=denoland/deno:bin-2.2.6 /deno /usr/local/bin/deno

# The port that your application listens to.
ENV PORT=8000
EXPOSE 8000

WORKDIR /app

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY src/deps.ts .
RUN deno install --entrypoint deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.ts

# Start the application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "src/main.ts"]