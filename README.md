# brain-bench-fe

NextJS frontend for the BrainBench project. See deployed site at [brainbench.xyz](https://brainbench.xyz).

## Adding benchmarks

If you would like to add or modify existing benchmarks, open a PR against our benchmarking repo [brain-bench-runner]

## Local Development

### Pull Repository

```zsh
git clone https://github.com/inference-labs-inc/brain-bench-fe.git
```

### Navigate to the `site` directory

```zsh
cd brain-bench-fe/site
```

### Install Dependencies

```zsh
pnpm install
```

### Start Development Server

```zsh
pnpm dev
```

## Deployment

Deployments are handled via Vercel. Pushing to the `main` branch will trigger a new deployment.

## References

Our frontend was constructed on the foundation that Polybase created for [zkBench.dev](zkbench.dev), and our benchmark suite utilizes [EZKL's ZKML Benchmarking Suite] with a custom GitHub Actions workflow and updated metrics.

- [EZKL's ZKML Benchmarking Suite]
- [Polybase's zkBench.dev frontend](https://github.com/polybase/zk-benchmarks)

[EZKL's ZKML Benchmarking Suite]: https://github.com/zkonduit/zkml-framework-benchmarks
