# AI Engineering Beginner Comic — ImageGen prompt set

Mode: built-in ImageGen. The first image was generated from text only. The next three used the first image as the character/style reference.

## 1. Hero

```text
Use case: illustration-story
Asset type: wide 16:9 blog hero for a beginner-friendly Traditional Chinese comic article
Primary request: Create a polished six-beat comic journey showing how an AI assistant grows from a simple instruction follower into a coordinated system. The recurring human character is Xiaoqing, a friendly young East Asian café owner with a short dark bob haircut, round navy glasses, a mustard-yellow apron over a cream shirt, navy trousers, and white sneakers. The recurring AI character is Atu, a small friendly cream-colored rounded desktop robot with a navy face screen, two lime-green expressive eyes, short arms, and a tiny cobalt antenna. Beat 1: Xiaoqing gives Atu a simple order beside a blank order card. Beat 2: she supplies a neat basket of recipe cards and customer notes. Beat 3: Atu safely uses a calculator, calendar, and small kitchen tool station. Beat 4: Atu notices a failed cake, checks it, repairs the recipe, and tries again within a visible bounded circular path. Beat 5: Atu coordinates several specialized helper machines along branching paths that merge into one completed café plan. Beat 6: Xiaoqing and Atu proudly present a successful café service result.
Scene/backdrop: bright cozy modern café blended with clean system-diagram motifs; panels connected like a visual journey.
Style/medium: clean editorial comic illustration, expressive characters, crisp ink outlines, flat cel shading, subtle paper grain, sophisticated rather than childish.
Composition/framing: wide landscape, six clear sequential visual beats separated by gutters or environmental transitions; readable actions at blog width; strong hero composition.
Lighting/mood: warm daylight, optimistic, curious, welcoming.
Color palette: warm off-white, charcoal navy, mustard yellow, acid lime highlights, restrained cobalt blue, small coral accents.
Constraints: preserve character design across all beats; no readable text, no speech bubbles, no letters, no numbers, no logos, no trademarks, no watermark; visual storytelling must work without text.
Avoid: dark cyberpunk, humanoid robot, photorealism, clutter, distorted hands, pseudo-writing.
```

## 2. Prompt and Context

```text
Use case: identity-preserve / illustration-story
Asset type: wide four-panel comic section illustration for a beginner AI engineering article
Input images: Image 1 is the character and style anchor. Preserve Xiaoqing and Atu exactly.
Primary request: Continue the café story in four clear panels explaining Prompt Engineering and Context Engineering visually. Panel 1: Xiaoqing vaguely gestures for Atu to “make something good”; Atu looks confused and produces a strange plain cake. Panel 2: Xiaoqing gives a precise visual instruction using icons for strawberry cake, two layers, no nuts, and a neat plate; Atu produces the correct cake. Panel 3: a customer request arrives, but Atu has only the instruction and guesses the wrong item because it lacks background information. Panel 4: Xiaoqing supplies a tidy basket containing customer preference cards, allergy symbols, today’s inventory, recipe book, and recent order history; Atu selects the right dessert confidently.
Scene/backdrop: same bright cozy café.
Subject: same Xiaoqing—young East Asian café owner, short dark bob, round navy glasses, mustard-yellow apron, cream shirt—and same small cream rounded robot Atu with navy face screen, lime eyes, cobalt antenna.
Style/medium: exactly match Image 1’s clean editorial comic, crisp ink, flat cel shading, subtle paper grain.
Composition/framing: four equal panels in one wide landscape image; actions large and immediately understandable; visual contrast between vague instruction, precise instruction, missing context, and supplied context.
Color palette: preserve Image 1.
Constraints: do not redesign characters; preserve face, proportions, outfit, robot shape, palette and personality; no readable text, no speech bubbles, no letters, no numbers, no logos, no watermark.
Avoid: pseudo-writing, tiny details, clutter, dark mood, photorealism.
```

## 3. Harness and Loop

```text
Use case: identity-preserve / illustration-story
Asset type: wide four-panel comic section illustration for a beginner AI engineering article
Input images: Image 1 is the character and style anchor. Preserve Xiaoqing and Atu exactly.
Primary request: Continue the café story in four panels explaining Harness Engineering and Loop Engineering visually. Panel 1: Xiaoqing equips Atu at a clearly organized safe workstation with a calculator, recipe book, timer, calendar, ingredient cabinet, protective rail, permission key, and activity clipboard—Atu can now act, not merely answer. Panel 2: Atu reaches toward a locked high-risk oven control but a friendly shield-shaped safety gate stops it and asks Xiaoqing for approval; she approves with a key card. Panel 3: Atu bakes a cake, examines a cracked failed result with a magnifying glass, compares it against a visual quality checklist, adjusts one recipe dial, and tries again along a clearly bounded lime-green circular arrow. Panel 4: the second cake passes an external quality gauge; Atu stops immediately and presents it, while a small exhausted budget meter still has a little capacity left.
Scene/backdrop: same bright cozy café and tool station.
Subject: same Xiaoqing—young East Asian café owner, short dark bob, round navy glasses, mustard-yellow apron, cream shirt—and same small cream rounded robot Atu with navy face screen, lime eyes, cobalt antenna.
Style/medium: exactly match Image 1’s clean editorial comic, crisp ink, flat cel shading, subtle paper grain.
Composition/framing: four equal panels in one wide landscape image; large readable actions; show safe tool access first, bounded feedback loop second.
Color palette: preserve Image 1.
Constraints: do not redesign characters; preserve face, proportions, outfit, robot shape, palette and personality; no readable text, no speech bubbles, no letters, no numbers, no logos, no watermark. Icons and gauges may be symbolic without text.
Avoid: pseudo-writing, unsafe chaotic tools, infinite spiral, dark mood, photorealism, clutter.
```

## 4. Graph

```text
Use case: identity-preserve / illustration-story
Asset type: wide four-panel comic section illustration for a beginner AI engineering article
Input images: Image 1 is the character and style anchor. Preserve Xiaoqing and Atu exactly.
Primary request: Continue the café story in four panels explaining Graph Engineering visually. Panel 1: a large catering order arrives and one Atu looks overwhelmed by many simultaneous tasks. Panel 2: Xiaoqing and Atu lay out a clear branching workflow map on a table using colorful icon cards: order intake branches to ingredient checker, baker, drink maker, and delivery planner. Panel 3: four distinct small specialist helper machines work in parallel at separate stations, each returning an artifact along visible navy paths into one lime-green merge gate; a shield gate and a human approval station are clearly visible on the risky branch. Panel 4: the paths merge into one coordinated catering cart with cake, drinks, inventory list, and delivery package; Xiaoqing checks the final result while Atu monitors a central state-and-checkpoint board, everyone calm and successful.
Scene/backdrop: same bright cozy café expanded into an organized service workspace.
Subject: same Xiaoqing—young East Asian café owner, short dark bob, round navy glasses, mustard-yellow apron, cream shirt—and same small cream rounded robot Atu with navy face screen, lime eyes, cobalt antenna. Specialist helper machines should be visually related but clearly different tools, not extra copies of Atu.
Style/medium: exactly match Image 1’s clean editorial comic, crisp ink, flat cel shading, subtle paper grain.
Composition/framing: four equal panels in one wide landscape image; strong left-to-right story; branching and merging paths should be obvious without labels.
Color palette: preserve Image 1.
Constraints: do not redesign Xiaoqing or Atu; preserve face, proportions, outfit, robot shape, palette and personality; no readable text, no speech bubbles, no letters, no numbers, no logos, no watermark.
Avoid: corporate org chart, humanoid robots, pseudo-writing, chaotic spaghetti arrows, dark cyberpunk, photorealism, clutter.
```
