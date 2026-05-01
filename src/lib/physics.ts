export type Difficulty = "beginner" | "intermediate" | "advanced";

export type VariableEntry = {
  symbol: string;
  name: string;
  value: string;
  unit: string;
  notes?: string;
};

export type AgentContribution = {
  name: string;
  task: string;
  result: string;
};

export type EquationEntry = {
  name: string;
  expression: string;
  variables: string[];
  reason: string;
};

export type SolutionStep = {
  title: string;
  explanation: string;
  equation?: string;
  result?: string;
};

export type VisualizationPoint = {
  x: number;
  y: number;
  label?: string;
};

export type VisualizationPlan = {
  graphType: string;
  xAxis: string;
  yAxis: string;
  data: VisualizationPoint[];
  notes?: string;
};

export type SolverResponse = {
  topic: string;
  difficulty: Difficulty;
  knownVariables: VariableEntry[];
  unknownVariables: VariableEntry[];
  agents: AgentContribution[];
  equations: EquationEntry[];
  stepByStepSolution: SolutionStep[];
  finalAnswer: string;
  commonMistakes: string[];
  visualizationPlan: VisualizationPlan;
  imagePrompt: string;
  assumptions: string[];
  dimensionalCheck: string;
  modelUsed?: string;
  source?: "openai" | "demo";
  warning?: string;
  savedRunId?: string;
  persistenceStatus?: "saved" | "not_configured" | "failed";
  persistenceMessage?: string;
};

export const agentRoster = [
  "Concept Agent",
  "Variable Extraction Agent",
  "Equation Selection Agent",
  "Algebra Agent",
  "Numerical Calculation Agent",
  "Visualization Agent",
  "Final Explanation Agent",
] as const;

export const solverJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "topic",
    "difficulty",
    "knownVariables",
    "unknownVariables",
    "agents",
    "equations",
    "stepByStepSolution",
    "finalAnswer",
    "commonMistakes",
    "visualizationPlan",
    "imagePrompt",
    "assumptions",
    "dimensionalCheck",
  ],
  properties: {
    topic: { type: "string" },
    difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
    knownVariables: {
      type: "array",
      items: { $ref: "#/$defs/variable" },
    },
    unknownVariables: {
      type: "array",
      items: { $ref: "#/$defs/variable" },
    },
    agents: {
      type: "array",
      minItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "task", "result"],
        properties: {
          name: { type: "string" },
          task: { type: "string" },
          result: { type: "string" },
        },
      },
    },
    equations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "expression", "variables", "reason"],
        properties: {
          name: { type: "string" },
          expression: { type: "string" },
          variables: {
            type: "array",
            items: { type: "string" },
          },
          reason: { type: "string" },
        },
      },
    },
    stepByStepSolution: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "explanation", "equation", "result"],
        properties: {
          title: { type: "string" },
          explanation: { type: "string" },
          equation: { type: "string" },
          result: { type: "string" },
        },
      },
    },
    finalAnswer: { type: "string" },
    commonMistakes: {
      type: "array",
      items: { type: "string" },
    },
    visualizationPlan: {
      type: "object",
      additionalProperties: false,
      required: ["graphType", "xAxis", "yAxis", "data", "notes"],
      properties: {
        graphType: { type: "string" },
        xAxis: { type: "string" },
        yAxis: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["x", "y", "label"],
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              label: { type: "string" },
            },
          },
        },
        notes: { type: "string" },
      },
    },
    imagePrompt: { type: "string" },
    assumptions: {
      type: "array",
      items: { type: "string" },
    },
    dimensionalCheck: { type: "string" },
  },
  $defs: {
    variable: {
      type: "object",
      additionalProperties: false,
      required: ["symbol", "name", "value", "unit", "notes"],
      properties: {
        symbol: { type: "string" },
        name: { type: "string" },
        value: { type: "string" },
        unit: { type: "string" },
        notes: { type: "string" },
      },
    },
  },
} as const;

export function createFallbackSolution(problem: string): SolverResponse {
  const lower = problem.toLowerCase();
  const newtonSecondLawSolution = createNewtonSecondLawSolution(problem, lower);

  if (newtonSecondLawSolution) {
    return newtonSecondLawSolution;
  }

  if (lower.includes("projectile") || lower.includes("20 m/s")) {
    return {
      topic: "Projectile motion",
      difficulty: "beginner",
      knownVariables: [
        { symbol: "v_0", name: "initial speed", value: "20", unit: "m/s", notes: "Launch speed" },
        { symbol: "theta", name: "launch angle", value: "30", unit: "degrees", notes: "Measured above horizontal" },
        { symbol: "g", name: "gravitational acceleration", value: "9.81", unit: "m/s^2", notes: "Downward" },
      ],
      unknownVariables: [
        { symbol: "R", name: "range", value: "unknown", unit: "m", notes: "Horizontal distance" },
        { symbol: "H", name: "maximum height", value: "unknown", unit: "m", notes: "Peak vertical displacement" },
      ],
      agents: buildAgentFallback([
        "Classified the problem as ideal projectile motion without air resistance.",
        "Extracted launch speed, angle, and gravitational acceleration.",
        "Selected range and peak height formulas for level-ground launch.",
        "Resolved velocity into horizontal and vertical components.",
        "Calculated range as 35.3 m and maximum height as 5.10 m.",
        "Planned a parabolic trajectory graph with time as the horizontal parameter.",
        "Checked units and wrote the final answer with assumptions.",
      ]),
      equations: [
        {
          name: "Range on level ground",
          expression: "R = \\frac{v_0^2\\sin(2\\theta)}{g}",
          variables: ["R", "v_0", "theta", "g"],
          reason: "The projectile lands at the same vertical height it was launched from.",
        },
        {
          name: "Maximum height",
          expression: "H = \\frac{v_0^2\\sin^2(\\theta)}{2g}",
          variables: ["H", "v_0", "theta", "g"],
          reason: "Vertical velocity becomes zero at the top of the trajectory.",
        },
      ],
      stepByStepSolution: [
        {
          title: "Resolve the launch",
          explanation: "The vertical component is v_y = v_0 sin(theta) = 20 sin(30 degrees) = 10 m/s.",
          equation: "v_y = v_0\\sin(\\theta)",
          result: "v_y = 10 m/s",
        },
        {
          title: "Find range",
          explanation: "For level-ground projectile motion, use the range equation.",
          equation: "R = \\frac{20^2\\sin(60^\\circ)}{9.81}",
          result: "R = 35.3 m",
        },
        {
          title: "Find maximum height",
          explanation: "At the highest point the vertical velocity is zero.",
          equation: "H = \\frac{10^2}{2(9.81)}",
          result: "H = 5.10 m",
        },
      ],
      finalAnswer: "Range is about 35.3 m and maximum height is about 5.10 m, assuming level ground and no air resistance.",
      commonMistakes: [
        "Using degrees as radians in the calculator.",
        "Forgetting that the range formula only applies when launch and landing heights match.",
        "Using the full speed instead of the vertical component for maximum height.",
      ],
      visualizationPlan: {
        graphType: "trajectory",
        xAxis: "horizontal position (m)",
        yAxis: "height (m)",
        data: [
          { x: 0, y: 0, label: "launch" },
          { x: 7.1, y: 3.24, label: "rising" },
          { x: 17.65, y: 5.1, label: "peak" },
          { x: 28.2, y: 3.24, label: "falling" },
          { x: 35.3, y: 0, label: "landing" },
        ],
        notes: "Parabolic path for ideal projectile motion.",
      },
      imagePrompt: "Futuristic educational diagram of a projectile arc, labeled velocity components, gravity arrow, range, and maximum height, dark physics lab style.",
      assumptions: ["Launch and landing heights are equal.", "Air resistance is ignored.", "g = 9.81 m/s^2."],
      dimensionalCheck: "Range and height formulas reduce to meters because (m^2/s^2)/(m/s^2) = m.",
      source: "demo",
      warning: "Demo fallback used because the live AI call was unavailable.",
    };
  }

  if (lower.includes("parallel") || lower.includes("10") && lower.includes("20")) {
    return genericSolution(problem, "Circuits", "R_{eq}=\\frac{R_1R_2}{R_1+R_2}", "Equivalent resistance is 6.67 ohm for 10 ohm and 20 ohm in parallel.");
  }

  if (lower.includes("photon") || lower.includes("500 nm") || lower.includes("wavelength")) {
    return genericSolution(problem, "Photon energy", "E=\\frac{hc}{\\lambda}", "For 500 nm light, photon energy is 3.98 x 10^-19 J, or about 2.48 eV.");
  }

  if (lower.includes("harmonic") || lower.includes("spring")) {
    return genericSolution(problem, "Simple harmonic motion", "\\omega=\\sqrt{\\frac{k}{m}}", "Use angular frequency omega = sqrt(k/m), then x(t)=A cos(omega t + phi).");
  }

  if (lower.includes("de broglie") || lower.includes("electron")) {
    return genericSolution(problem, "Matter waves", "\\lambda=\\frac{h}{p}", "Use lambda = h/p. For an electron, provide speed, momentum, or accelerating voltage for a numeric wavelength.");
  }

  return genericSolution(
    problem,
    "General physics analysis",
    "model\\;knowns\\;then\\;solve",
    "The problem was decomposed into concepts, variables, equations, algebra, numerical work, and verification."
  );
}

function createNewtonSecondLawSolution(problem: string, lower: string): SolverResponse | null {
  const asksForForce = lower.includes("force") || lower.includes("f=ma") || lower.includes("f = ma");
  const hasAccelerationCue = lower.includes("accelerat") || lower.includes("m/s");

  if (!asksForForce || !hasAccelerationCue) {
    return null;
  }

  const mass = extractUnitValue(problem, "(?:kg|kilograms?)");
  const acceleration = extractUnitValue(problem, "m\\s*/\\s*s\\s*(?:\\^?\\s*2|2)");

  if (mass === null || acceleration === null) {
    return genericSolution(
      problem,
      "Newton's second law",
      "F_{net}=ma",
      "Use Newton's second law: net force equals mass times acceleration. Provide mass in kg and acceleration in m/s^2 for a numeric answer."
    );
  }

  const force = mass * acceleration;
  const massText = formatPhysicsNumber(mass);
  const accelerationText = formatPhysicsNumber(acceleration);
  const forceText = formatPhysicsNumber(force);

  return {
    topic: "Newton's second law",
    difficulty: "beginner",
    knownVariables: [
      { symbol: "m", name: "mass", value: massText, unit: "kg", notes: "Mass of the object." },
      { symbol: "a", name: "acceleration", value: accelerationText, unit: "m/s^2", notes: "Acceleration of the object." },
    ],
    unknownVariables: [
      { symbol: "F_{net}", name: "net force", value: "unknown", unit: "N", notes: "The total unbalanced force causing the acceleration." },
    ],
    agents: buildAgentFallback([
      "Classified the problem as Newton's second law for a constant-mass object.",
      `Extracted mass ${massText} kg and acceleration ${accelerationText} m/s^2 from the prompt.`,
      "Selected F_net = ma because the target is net force.",
      "No rearrangement is needed because force is already isolated.",
      `Calculated F_net = ${massText} x ${accelerationText} = ${forceText} N.`,
      "Planned a simple force bar model that connects mass, acceleration, and net force.",
      "Reported the force in newtons and stated the constant-mass assumption.",
    ]),
    equations: [
      {
        name: "Newton's second law",
        expression: "F_{net}=ma",
        variables: ["F_{net}", "m", "a"],
        reason: "For a constant-mass object, the net force equals mass times acceleration.",
      },
    ],
    stepByStepSolution: [
      {
        title: "Identify the model",
        explanation: "The object has a given mass and acceleration, so Newton's second law connects those values to net force.",
        equation: "F_{net}=ma",
        result: "Use Newton's second law.",
      },
      {
        title: "Substitute values",
        explanation: "Multiply the mass by the acceleration while keeping units attached.",
        equation: `F_{net}=(${massText}\\,\\text{kg})(${accelerationText}\\,\\text{m/s}^2)`,
        result: `F_{net}=${forceText}\\,\\text{N}`,
      },
      {
        title: "Interpret the result",
        explanation: "One newton is one kg*m/s^2, so the unit from mass times acceleration is force.",
        equation: "1\\,\\text{N}=1\\,\\text{kg}\\,\\text{m/s}^2",
        result: `The net force is ${forceText} N.`,
      },
    ],
    finalAnswer: `The net force is ${forceText} N.`,
    commonMistakes: [
      "Using weight mg when the problem asks for net force from acceleration.",
      "Dropping the unit conversion that 1 N = 1 kg*m/s^2.",
      "Adding extra forces when the net acceleration already gives the net force.",
    ],
    visualizationPlan: {
      graphType: "force bar model",
      xAxis: "quantity",
      yAxis: "value",
      data: [
        { x: 0, y: mass, label: "mass kg" },
        { x: 1, y: acceleration, label: "acceleration" },
        { x: 2, y: force, label: "net force N" },
      ],
      notes: "A compact bar model showing the known mass, known acceleration, and resulting net force.",
    },
    imagePrompt: "Clean educational Newton's second law diagram with a block, acceleration arrow, net force arrow, and labeled equation F_net = ma.",
    assumptions: ["The object's mass is constant.", "The given acceleration is caused by the net unbalanced force.", "Mass is in kg and acceleration is in m/s^2."],
    dimensionalCheck: "kg x m/s^2 = kg*m/s^2 = N.",
    source: "demo",
    warning: "Demo fallback used because the live AI call was unavailable.",
  };
}

function extractUnitValue(text: string, unitPattern: string): number | null {
  const match = text.match(new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i"));
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function formatPhysicsNumber(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(3).replace(/\.?0+$/, "");
}

function buildAgentFallback(results: string[]): AgentContribution[] {
  return agentRoster.map((name, index) => ({
    name,
    task: agentTasks[index],
    result: results[index] ?? "Prepared a focused contribution for this part of the solution.",
  }));
}

const agentTasks = [
  "Identify the physical model and conceptual assumptions.",
  "Extract known values, units, and unknown targets.",
  "Select equations that connect knowns to unknowns.",
  "Rearrange equations symbolically before substituting numbers.",
  "Compute numerical values and preserve units.",
  "Design graphs, diagrams, and simulations to explain the result.",
  "Produce a clear final explanation and caution about common mistakes.",
];

function genericSolution(problem: string, topic: string, equation: string, finalAnswer: string): SolverResponse {
  return {
    topic,
    difficulty: "intermediate",
    knownVariables: [
      { symbol: "given", name: "problem statement", value: problem.slice(0, 180), unit: "text", notes: "Parsed from student input" },
    ],
    unknownVariables: [
      { symbol: "target", name: "requested quantity", value: "unknown", unit: "depends on topic", notes: "Clarified by the problem wording" },
    ],
    agents: buildAgentFallback([
      `Classified the prompt as ${topic}.`,
      "Identified the quantities that must be connected by a physics relationship.",
      `Selected ${equation} as the central relationship.`,
      "Outlined algebra before substitution to keep the logic inspectable.",
      "Computed or described the numeric path with units.",
      "Prepared a graph or diagram plan to make the result visual.",
      "Summarized the answer and called out assumptions.",
    ]),
    equations: [
      {
        name: "Core relationship",
        expression: equation,
        variables: ["known", "unknown"],
        reason: `This is the most direct relationship for ${topic}.`,
      },
    ],
    stepByStepSolution: [
      {
        title: "Read the physical model",
        explanation: "Translate the wording into a known physics category and list assumptions before calculating.",
        equation,
        result: "Model selected.",
      },
      {
        title: "Connect knowns to the target",
        explanation: "Use the equation that includes the requested unknown and the given values.",
        equation,
        result: "Equation path selected.",
      },
      {
        title: "Calculate and verify",
        explanation: "Substitute values with units, then verify the result has the expected dimensions.",
        equation,
        result: finalAnswer,
      },
    ],
    finalAnswer,
    commonMistakes: [
      "Skipping unit conversion before substitution.",
      "Using a formula without checking its assumptions.",
      "Reporting only a number without explaining the physical meaning.",
    ],
    visualizationPlan: {
      graphType: "concept graph",
      xAxis: "step",
      yAxis: "relative quantity",
      data: [
        { x: 0, y: 0.2, label: "knowns" },
        { x: 1, y: 0.55, label: "equations" },
        { x: 2, y: 0.8, label: "calculation" },
        { x: 3, y: 1, label: "answer" },
      ],
      notes: "Fallback visualization for a general physics solution.",
    },
    imagePrompt: `High-quality futuristic educational physics diagram for ${topic}, with labeled variables, equations, and clean neon annotations.`,
    assumptions: ["The prompt may need additional values for a fully numeric answer.", "Standard textbook approximations are used unless stated otherwise."],
    dimensionalCheck: "Check that substituted quantities produce the unit of the target variable.",
    source: "demo",
    warning: "Demo fallback used because the live AI call was unavailable.",
  };
}

export function ensureVisualizationData(solution: SolverResponse): SolverResponse {
  if (solution.visualizationPlan.data.length > 0) {
    return solution;
  }

  return {
    ...solution,
    visualizationPlan: {
      ...solution.visualizationPlan,
      data: [
        { x: 0, y: 0.15, label: "start" },
        { x: 1, y: 0.48, label: "model" },
        { x: 2, y: 0.74, label: "solve" },
        { x: 3, y: 1, label: "verify" },
      ],
      notes: solution.visualizationPlan.notes || "Generated sample data for visualization continuity.",
    },
  };
}
