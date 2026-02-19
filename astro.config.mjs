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
			],
		}),
	],
});
