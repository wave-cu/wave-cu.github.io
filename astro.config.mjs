// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://wave-cu.github.io',
	integrations: [
		starlight({
			title: 'Bioinformatic Fridays',
			logo: {
				light: './src/assets/wave-cu-biofridays-logo.png',
				dark: './src/assets/wave-cu-biofridays-logo.png',
				alt: 'WAVE-CU Bioinformatic Fridays',
				replacesTitle: true,
			},
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/wave-cu' }],
			sidebar: [
				{
					label: 'Course Overview',
					items: [
						{ label: 'Bioinformatic Fridays', slug: '' },
					],
				},
				{
					label: 'Module 1: Linux for Bioinformatics',
					items: [
						{ label: 'Module Overview', slug: 'module-1-linux' },
						{ label: 'Lesson 1: Fundamentals and Basic Commands', slug: 'module-1-linux/lesson-1-fundamentals-and-basic-commands' },
						{ label: 'Lesson 2: Text Processing, Pipes, and Redirection', slug: 'module-1-linux/lesson-2-text-processing-and-pipes' },
						{ label: 'Lesson 3: Scripting and Permissions', slug: 'module-1-linux/lesson-3-scripting-and-permissions' },
						{ label: 'Lesson 4: SSH and Remote Work', slug: 'module-1-linux/lesson-4-ssh-and-remote-work' },
						{ label: 'Lesson 5: Absolute and Relative Paths', slug: 'module-1-linux/lesson-5-absolute-and-relative-paths' },
					],
				},
				{
					label: 'Module 2: Conda for Bioinformatics',
					items: [
						{ label: 'Module Overview', slug: 'module-2-conda' },
						{ label: 'Lesson 1: What Is Conda and Why We Use It', slug: 'module-2-conda/lesson-1-what-is-conda' },
						{ label: 'Lesson 2: Channels, Licensing, and Bioconda', slug: 'module-2-conda/lesson-2-channels-and-licensing' },
						{ label: 'Lesson 3: Managing Environments', slug: 'module-2-conda/lesson-3-managing-environments' },
						{ label: 'Lesson 4: Channel Priority and Best Practices', slug: 'module-2-conda/lesson-4-channel-priority-and-best-practices' },
						{ label: 'Lesson 5: Building a Bioinformatics Environment', slug: 'module-2-conda/lesson-5-building-a-bioinformatics-environment' },
					],
				},
				{
					label: 'Module 3: Omics Analysis',
					items: [
						{ label: 'Module Overview', slug: 'module-3-omics' },
						{ label: 'Lesson 1: The Omics Hierarchy and File Architecture', slug: 'module-3-omics/lesson-1-the-omics-hierarchy' },
						{ label: 'Lesson 2: Precision Quality Control', slug: 'module-3-omics/lesson-2-quality-control' },
						{ label: 'Lesson 3: Genome Assembly Foundations', slug: 'module-3-omics/lesson-3-genome-assembly-foundations' },
						{ label: 'Lesson 4: De Novo Assembly with Long Reads', slug: 'module-3-omics/lesson-4-de-novo-assembly' },
						{ label: 'Lesson 5: Reference-Based Assembly', slug: 'module-3-omics/lesson-5-reference-based-assembly' },
					],
				},
				{
					label: 'Module 4: Recap Exercises',
					items: [
						{ label: 'Module Overview', slug: 'module-4-recap-exercises' },
						{ label: 'Exercise 1: Linux Foundations', slug: 'module-4-recap-exercises/exercise-1-linux-foundations' },
						{ label: 'Exercise 2: Text Processing and Pipelines', slug: 'module-4-recap-exercises/exercise-2-text-processing' },
						{ label: 'Exercise 3: Conda and Environment Management', slug: 'module-4-recap-exercises/exercise-3-conda-and-environments' },
						{ label: 'Exercise 4: Omics Integration', slug: 'module-4-recap-exercises/exercise-4-omics-integration' },
						{ label: 'Solutions', slug: 'module-4-recap-exercises/solutions' },
					],
				},
				{
					label: 'Module 5: Project',
					items: [
						{ label: 'Begomovirus Phylogenetics Project', slug: 'module-5-project' },
					],
				},
				{
					label: 'Module 6: Computational Thinking',
					items: [
						{ label: 'Module Overview', slug: 'module-6-problem-solving' },
						{ label: 'Lesson 1: Introduction to Computational Thinking', slug: 'module-6-problem-solving/lesson-1-introduction-to-computational-thinking' },
						{ label: 'Lesson 2: Core Principles and Bioinformatics', slug: 'module-6-problem-solving/lesson-2-core-principles-and-bioinformatics' },
						{ label: 'Lesson 3: Decomposition and Pattern Recognition', slug: 'module-6-problem-solving/lesson-3-decomposition-and-pattern-recognition' },
						{ label: 'Lesson 4: Abstraction and Algorithm Design', slug: 'module-6-problem-solving/lesson-4-abstraction-and-algorithm-design' },
						{ label: 'Lesson 5: Computational Thinking in Action', slug: 'module-6-problem-solving/lesson-5-computational-thinking-in-action' },
						{ label: 'Exercises', slug: 'module-6-problem-solving/exercises' },
						{ label: 'Solutions', slug: 'module-6-problem-solving/solutions' },
						{ label: 'Appendix: Pitfalls and Debugging', slug: 'module-6-problem-solving/appendix-pitfalls-and-debugging' },
					],
				},
				{
					label: 'Module 7: Bash Scripting',
					items: [
						{ label: 'Module Overview', slug: 'module-7-bash-scripting' },
						{ label: 'Lesson 1: What Is a Bash Script?', slug: 'module-7-bash-scripting/lesson-1-what-is-a-bash-script' },
						{ label: 'Lesson 2: Your First Script and the Shebang Line', slug: 'module-7-bash-scripting/lesson-2-shebang-and-first-script' },
						{ label: 'Lesson 3: Variables and basename', slug: 'module-7-bash-scripting/lesson-3-variables-and-basename' },
						{ label: 'Lesson 4: Simple For Loops', slug: 'module-7-bash-scripting/lesson-4-simple-for-loops' },
						{ label: 'Lesson 5: Saving Output to a Log File', slug: 'module-7-bash-scripting/lesson-5-saving-output-to-a-log-file' },
						{ label: 'Lesson 6: Putting It All Together', slug: 'module-7-bash-scripting/lesson-6-putting-it-all-together' },
						{ label: 'Exercises', slug: 'module-7-bash-scripting/exercises' },
						{ label: 'Solutions', slug: 'module-7-bash-scripting/solutions' },
					],
				},
			],
		}),
	],
});
