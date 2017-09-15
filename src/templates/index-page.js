export default `# Hello,  world!

Welcome to your new Octopus-powered page! It will serve you great as an internal knowledge base or documentation.

It has a native **Markdown** support which makes it easy for non-technical people to contribute. No admin panel, no databases, no HTML skills required - just a simple text editor.

It also supports **diagrams** to make writing technical documentation a breeze. You do not need external software to include a system diagram. It will really help you communicate technical projects to other people.

Here's an example:

[diagram]
digraph {
"Web browser" [style=dashed]
"REST API" [style=filled fillcolor="#eeffbb"]
"back-end server" [style=filled fillcolor="#ffdddd"]

"Web browser" -> "REST API" [label="HTTP GET"]
"REST API" -> "back-end server" -> "REST API" [style=dashed]
"REST API" -> "Web browser" [label="HTTP 200"]
}
[/diagram]

Octopus supports flowcharts as well:

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

To read more about using diagrams, go to [Diagrams Help](/diagrams-help) page.

Happy knowledge sharing!`;
