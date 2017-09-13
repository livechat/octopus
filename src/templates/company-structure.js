export default `# Company structure

[diagram]
digraph {
CEO [label="John Smith\\n(CEO)"]
CMO [label="Mary Brown\\n(CMO)"]
CTO [label="Jane Gray\\n(CTO)"]
CFO [label="William Shake\\n(CFO)"]

CEO->CMO
CEO->CTO
CEO->CFO
}
[/diagram]

## Marketing teams
Manager: Mary Brown (CMO)

### Teams
[diagram]
digraph {
subgraph cluster_marketing {
	label=<<u><b>Inbound Marketing</b></u>>

		marketing [shape=record penwidth=0 label="
		Person 1 \\n
		Person 2 \\n
		Person 3 \\n
		Person 4
	"]
}

subgraph cluster_content {
	label=<<u><b>Outbound Marketing</b></u>>

		content [shape=record penwidth=0 label="
		Person 1 \\n
    Person 2 \\n
    Person 3 \\n
	"]
}
}
[/diagram]

## Product teams
Manager: Jane Gray (CTO)

### Teams
[diagram]
digraph {
subgraph cluster_product_1 {
	label=<<u><b>Product #1</b></u>>

	product_1 [shape=record penwidth=0 label="
		Person 1 (Team leader) \\n
		Person 2 \\n
		Person 3 \\n
		Person 4 \\n
		Person 5
	"]
}
subgraph cluster_product_2 {
	label=<<u><b>Product #2</b></u>>

	product_2 [shape=record penwidth=0 label="
		Person 1 (Team leader) \\n
		Person 2 \\n
		Person 3 \\n
		Person 4
	"]
}
}
[/diagram]

## Finance
Manager: William Shake (CFO)

[diagram]
digraph {
	finance [shape=record label="
		Person 1 \\n
		Person 2
	"]
}
[/diagram]
`;
