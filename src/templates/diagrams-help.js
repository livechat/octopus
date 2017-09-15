export default `# Diagrams help
Octopus supports powerful **diagrams** feature. It lets you embed advanced graphs to your content without any external software.

Two diagramming tools are supported:
* [Graphviz](http://www.graphviz.org)
* [flowchart.js](http://flowchart.js.org)

## Graphviz
To embed a Graphviz diagram, include the diagram definition between \`[diagram]\` and \`[/diagram]\` tags.

The diagrams are written in DOT language. To learn more, read the [DOT language documentation](http://www.graphviz.org/content/dot-language) or browse [Diagrams Gallery](http://www.graphviz.org/Gallery.php).

To learn how to build advanced graphs, read the [full article on DOT](http://www.graphviz.org/pdf/dotguide.pdf) (in PDF format).

### Basic graph
Code

\`\`\`
[diagram]
digraph {
A->B
B->C
C->A
}
[/diagram]
\`\`\`

Result

[diagram]
digraph {
A->B
B->C
C->A
}
[/diagram]

### Company structure

Code

\`\`\`
[diagram]
digraph {
CEO [label="John Smith\n(CEO)"]
CMO [label="Mary Brown\n(CMO)"]
CTO [label="Jane Gray\n(CTO)"]
CFO [label="William Shake\n(CFO)"]

CEO->CMO
CEO->CTO
CEO->CFO
}
[/diagram]
\`\`\`

Result

[diagram]
digraph {
CEO [label="John Smith\n(CEO)"]
CMO [label="Mary Brown\n(CMO)"]
CTO [label="Jane Gray\n(CTO)"]
CFO [label="William Shake\n(CFO)"]

CEO->CMO
CEO->CTO
CEO->CFO
}
[/diagram]

### Process

Code

\`\`\`
[diagram]
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;

	start [shape=Mdiamond];
	end [shape=Msquare];
}
[/diagram]
\`\`\`

Result

[diagram]
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;

	start [shape=Mdiamond];
	end [shape=Msquare];
}
[/diagram]

### More examples
Find more examples in the [Diagrams Gallery](http://www.graphviz.org/Gallery.php).

## flowchart.js
To embed a flowchart.js diagram, include the diagram definition between \`[flowchart]\` and \`[/flowchart]\` tags.

Read more on the [flowchart.js project page](http://flowchart.js.org).

### Example

Code

\`\`\`
[flowchart]
st=>start
e=>end
op1=>operation: My operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
[/flowchart]
\`\`\`

Result

[flowchart]
st=>start
e=>end
op1=>operation: My operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
[/flowchart]
`;
