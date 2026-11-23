// Edit research text, links, results, and media paths here. Paths are relative for GitHub Pages.
// null resource URLs intentionally render as unavailable. See research/media-provenance.json.
window.GEM_CONFIG = {
  "presentation": {
    "animations": true
  },
  "identity": {
    "gemAsset": "public/favicon.svg",
    "skillTones": [
      "jade",
      "amber",
      "rose",
      "blue"
    ]
  },
  "evaluation": {
    "automaticTrials": 10,
    "manualTrials": 5
  },
  "paper": {
    "acronym": "GEM",
    "title": "Generalizable Skill Discovery through Action–Effect Mining for Agentic Robot Garment Manipulation",
    "authors": [
      {
        "name": "Author names to be added",
        "affiliation": null,
        "url": null
      }
    ],
    "affiliations": [
      "Affiliations to be added"
    ],
    "authorsPending": true,
    "links": {
      "paper": null,
      "arxiv": null,
      "code": null,
      "supplementary": null
    },
    "abstract": "Recent advances in vision-language agents have enabled strong zero-shot performance on semantically grounded robot manipulation tasks, such as long-horizon pick-and-place tasks. However, their effectiveness remains limited in more complex tasks like real-world garment unfolding, where severe self-occlusion and complex deformable dynamics lead to inefficient exploration and low success rates. The key to overcoming these challenges lies in equipping agents with a repertoire of effective, generalizable manipulation skills. We present GEM, a framework that discovers and consolidates generalizable skills from an agent’s own zero-shot garment unfolding experience. Our key insight is to identify transitions with discrepancies between the agent’s stated intentions and observed outcomes, then consolidate them into reusable observation-conditioned manipulation skills after assessing their capability to solve previously encountered challenging observations. Real-world garment unfolding experiments demonstrate that GEM largely improves task success rates and expands the range of challenging configurations the agent can resolve. With the skill library frozen after acquisition on a single source T-shirt, GEM achieves a 93.3% unfolding success rate on seven unseen T-shirts, compared with 52.4% for the zero-shot base agent.",
    "bibtex": "@misc{gem,\n  title = {{GEM}: Generalizable Skill Discovery through\n           Action--Effect Mining for Agentic Robot\n           Garment Manipulation},\n  author = {AUTHORS_TO_BE_ADDED},\n  year = {YEAR_TO_BE_ADDED},\n  note = {Preprint details pending public release}\n}"
  },
  "media": {
    "hero": {
      "video": "public/videos/GEM_demo.mp4",
      "poster": "public/images/GEM_demo.jpg",
      "autoplay": true
    },
    "method": "public/images/method-overview.webp",
    "teaser": "public/images/teaser.webp",
    "skills": [
      {
        "name": "Opposite-Side Unfolding",
        "tabLabel": "Opposite-side",
        "video": null,
        "poster": null,
        "description": "Use a visible side of the garment to expose a concealed or opposite region.",
        "speed": 8
      },
      {
        "name": "Make Space",
        "tabLabel": "Make space",
        "video": null,
        "poster": null,
        "description": "Move the garment inward when the table edge constrains the next manipulation.",
        "speed": 8
      },
      {
        "name": "Folded-Flap Unfolding",
        "tabLabel": "Folded flap",
        "video": null,
        "poster": null,
        "description": "Grasp and reposition a visible folded flap to open the fabric layer.",
        "speed": 8
      },
      {
        "name": "Sleeve Extension",
        "tabLabel": "Sleeve extension",
        "video": null,
        "poster": null,
        "description": "Pull a retracted sleeve outward using visible garment geometry.",
        "speed": 8
      }
    ],
    "garments": [
      {
        "id": "G0",
        "label": "Source T-shirt",
        "size": "Small",
        "image": "public/images/g0-garment.webp",
        "role": "Source garment",
        "speed": 32,
        "results": {
          "base": {
            "auto": 9,
            "manual": 4
          },
          "gem": {
            "auto": 10,
            "manual": 5
          }
        }
      },
      {
        "id": "G1",
        "label": "Gray T-shirt",
        "size": "Large",
        "video": "public/videos/G1_2x_web.mp4",
        "poster": "public/images/G1-execution-poster.jpg",
        "image": "public/images/g1-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 6,
            "manual": 1
          },
          "gem": {
            "auto": 10,
            "manual": 4
          }
        },
        "missingMessage": null
      },
      {
        "id": "G2",
        "label": "White graphic T-shirt",
        "size": "Large",
        "video": "public/videos/G2_2x_web.mp4",
        "poster": "public/images/G2-execution-poster.jpg",
        "image": "public/images/g2-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 5,
            "manual": 0
          },
          "gem": {
            "auto": 9,
            "manual": 4
          }
        },
        "missingMessage": null
      },
      {
        "id": "G3",
        "label": "White cat T-shirt",
        "size": "Medium",
        "video": "public/videos/G3_2x_web.mp4",
        "poster": "public/images/G3-execution-poster.jpg",
        "image": "public/images/g3-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 8,
            "manual": 1
          },
          "gem": {
            "auto": 10,
            "manual": 5
          }
        },
        "missingMessage": null
      },
      {
        "id": "G4",
        "label": "Pink graphic T-shirt",
        "size": "Large",
        "video": "public/videos/G4_2x_web.mp4",
        "poster": "public/images/G4-execution-poster.jpg",
        "image": "public/images/g4-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 4,
            "manual": 0
          },
          "gem": {
            "auto": 9,
            "manual": 3
          }
        },
        "missingMessage": null
      },
      {
        "id": "G5",
        "label": "Black T-shirt",
        "size": "Large",
        "video": "public/videos/G5_2x_web.mp4",
        "poster": "public/images/G5-execution-poster.jpg",
        "image": "public/images/g5-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 5,
            "manual": 1
          },
          "gem": {
            "auto": 10,
            "manual": 4
          }
        },
        "missingMessage": null
      },
      {
        "id": "G6",
        "label": "Black graphic T-shirt",
        "size": "Small",
        "image": "public/images/g6-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 8,
            "manual": 3
          },
          "gem": {
            "auto": 10,
            "manual": 5
          }
        },
        "missingMessage": null,
        "video": "public/videos/G6_2x_web.mp4",
        "poster": "public/images/G6-execution-poster.jpg"
      },
      {
        "id": "G7",
        "label": "Blue cat T-shirt",
        "size": "Small",
        "image": "public/images/g7-garment.webp",
        "role": "Unseen garment",
        "speed": 2,
        "results": {
          "base": {
            "auto": 9,
            "manual": 4
          },
          "gem": {
            "auto": 10,
            "manual": 5
          }
        },
        "missingMessage": null,
        "video": "public/videos/G7_2x_web.mp4",
        "poster": "public/images/G7-execution-poster.jpg"
      }
    ],
    "skillFigure": "public/images/skill-examples.webp",
    "results": "public/images/results.webp",
    "methodAnimated": "public/images/method-animated.svg",
    "exploration": "public/images/method-exploration.webp",
    "effectMining": "public/images/method-effect-mining.webp"
  },
  "copy": {
    "heroSummary": "Discovering reusable manipulation skills from the gap between intention and physical outcome.",
    "heroChartTitle": "Unseen-garment success",
    "heroChartScope": "on seven unseen T-shirts",
    "heroCaption": "GEM project demonstration",
    "heroDetail": "1 min 54 sec",
    "insight": "GEM turns unexpected action effects into reusable manipulation skills, acquired on one T-shirt and transferred to seven unseen garments.",
    "methodTitle": "From unexpected effects to reusable skills",
    "methodIntro": "GEM compares the agent’s stated intention with what physically changed. It retains effects that could resolve recurring failures, then consolidates them into observation-conditioned skills.",
    "methodCaption": "GEM framework (Figure 3). Exploration and skill acquisition use a single source T-shirt. The skill library is frozen before deployment on unseen garments.",
    "skillsTitle": "Discovered skills",
    "skillsIntro": "Four skills address concealed regions, workspace constraints, folded layers, and retracted sleeves. Each is instantiated from visible garment structure and spatial relationships.",
    "experimentsTitle": "Real-world experiments",
    "experimentsIntro": "Skills acquired on G0 transfer to seven unseen T-shirts, without further skill acquisition or adaptation.",
    "resultsScope": "Unfolding success on seven unseen garments · 105 trials per method",
    "manualResult": "Under challenging manual resets, success rises from 28.6% (10/35) for the Base Agent to 85.7% (30/35) for GEM.",
    "galleryTitle": "Across garments, sizes, and configurations",
    "protocol": "Each garment has 10 Automatic Reset and 5 Manual Reset episodes. Automatic Reset lifts and releases the garment; Manual Reset adds challenging folds and self-occlusion. The action budget is 12 for small garments and 20 for medium and large garments.",
    "successCriterion": "Success requires both sleeves extended and the body broadly spread, without substantial folds or severe self-occlusion. Minor wrinkles are allowed.",
    "resultsCaption": "Figure 8. Each colored cell denotes a successful episode. Automatic Reset results are stacked below Manual Reset results. G0 is the source garment; G1–G7 are unseen.",
    "footer": "GEM · Agentic robot garment manipulation"
  },
  "framework": {
    "autoplay": true,
    "stepDuration": 6500,
    "viewBox": [
      0,
      0,
      1500,
      627.12
    ],
    "overview": {
      "title": "From experience to reusable skills",
      "body": "Failure evidence guides which surprising action effects are retained. All skill acquisition uses one source T-shirt."
    },
    "steps": [
      {
        "id": "explore",
        "label": "Explore",
        "title": "Record actions and their effects",
        "body": "On G0, the agent samples ranked actions and records the current observation, stated intention, action, and resulting observation. Higher-ranked actions are preferred, while lower-ranked candidates still have a chance to be tried.",
        "viewBox": [
          0,
          0,
          389,
          627.12
        ],
        "connectors": [],
        "detailTarget": "exploration"
      },
      {
        "id": "failures",
        "label": "Failures",
        "title": "Collect recurring difficulties",
        "body": "After exploration, a coding agent analyzes the recorded trajectories offline. Repeatedly stuck configurations and observations with limited progress form a failure library that guides subsequent mining.",
        "viewBox": [
          414,
          0,
          426,
          240
        ],
        "connectors": [
          "branches"
        ],
        "detailTarget": "mining"
      },
      {
        "id": "surprises",
        "label": "Surprises",
        "title": "Compare intention with outcome",
        "body": "The agent compares its original intention with the observed physical changes. Unanticipated effects become candidate action–effect relationships, including useful changes in unsuccessful interactions.",
        "viewBox": [
          414,
          262,
          426,
          365.12
        ],
        "connectors": [
          "branches"
        ],
        "detailTarget": "mining"
      },
      {
        "id": "verify",
        "label": "Verify",
        "title": "Keep effects that could help",
        "body": "Candidate effects are assessed against the failure library. Useful relationships are retained with their executed actions and supporting evidence; surprises without a relevant use are discarded.",
        "viewBox": [
          865,
          0,
          278,
          627.12
        ],
        "connectors": [
          "failure-input",
          "surprise-input"
        ],
        "detailTarget": "mining"
      },
      {
        "id": "skills",
        "label": "Skills",
        "title": "Consolidate observation-conditioned skills",
        "body": "Skills specify when to use them, how to act, and when to stop. The library is acquired on G0 and frozen for evaluation on G1–G7.",
        "viewBox": [
          1168,
          0,
          332,
          627.12
        ],
        "connectors": [
          "skill-output"
        ],
        "detailTarget": "transfer"
      }
    ]
  },
  "results": {
    "gem": {
      "successes": 98,
      "trials": 105,
      "rate": 93.3
    },
    "base": {
      "successes": 55,
      "trials": 105,
      "rate": 52.4
    }
  },
  "methodDetails": {
    "title": "Inside the method",
    "chapters": [
      {
        "id": "exploration",
        "label": "Exploration"
      },
      {
        "id": "mining",
        "label": "Effect mining"
      },
      {
        "id": "transfer",
        "label": "Skill transfer"
      }
    ],
    "exploration": {
      "title": "Explore beyond the top-ranked action",
      "intro": "The agent proposes several ways to act on the same observation. Sampling across their ranks broadens the physical experience available for skill discovery.",
      "figureCaption": "Figure 4. Diversity-oriented exploration on the source T-shirt. Select a step to inspect the corresponding part of the original figure.",
      "alt": "Figure 4: propose and rank actions, sample a rank, execute the selected action, and record its intention and outcome in a loop.",
      "overview": "Higher-ranked actions remain more likely, while every lower-ranked candidate retains a nonzero chance of being tried.",
      "steps": [
        {
          "id": "propose",
          "letter": "a",
          "title": "Propose & rank",
          "body": "Given the current RGB observation and goal image, the base agent proposes candidate actions. Each has an anticipated physical effect and a rank.",
          "image": "public/images/exploration-propose.webp",
          "alt": "Figure 4a. The agent proposes three actions from the current observation and goal image.",
          "bounds": [
            0,
            0,
            43.714,
            56.949
          ],
          "shortLabel": "Propose"
        },
        {
          "id": "sample",
          "letter": "b",
          "title": "Sample an action",
          "body": "GEM samples from a rank-biased distribution. The example selects the second-ranked action, “Pull the corner out,” instead of always choosing rank one.",
          "image": "public/images/exploration-sample.webp",
          "alt": "Figure 4b. Rank-biased sampling selects the second-ranked candidate, Pull the corner out.",
          "bounds": [
            46.714,
            0,
            53.286,
            56.949
          ],
          "shortLabel": "Sample"
        },
        {
          "id": "execute",
          "letter": "c",
          "title": "Execute & observe",
          "body": "The selected action is executed through the existing robot control interface. A new observation captures what physically changed.",
          "image": "public/images/exploration-execute.webp",
          "alt": "Figure 4c. The robot executes the second candidate action and observes the resulting garment configuration.",
          "bounds": [
            46.714,
            60.83,
            53.286,
            39.17
          ],
          "shortLabel": "Execute"
        },
        {
          "id": "record",
          "letter": "d",
          "title": "Record the interaction",
          "body": "Store the before observation, pre-execution intention, executed action, and after observation. A coding agent later analyzes these records offline for recurring difficulties and unexpected effects.",
          "image": "public/images/exploration-record.webp",
          "alt": "Figure 4d. Before and after observations are stored with the original intention and action.",
          "bounds": [
            0,
            60.83,
            43.714,
            39.17
          ],
          "shortLabel": "Record"
        }
      ],
      "detailsLabel": "The sampling rule and the interaction record",
      "recordLabel": "Each record contains",
      "recordFields": [
        {
          "symbol": "o",
          "subscript": "t",
          "label": "Before observation"
        },
        {
          "symbol": "i",
          "subscript": "t",
          "label": "Stated intention"
        },
        {
          "symbol": "a",
          "subscript": "t",
          "label": "Executed action"
        },
        {
          "symbol": "o",
          "subscript": "t+1",
          "label": "After observation"
        }
      ],
      "mobileOverviewTitle": "A broader exploration loop"
    },
    "mining": {
      "title": "Not every surprise is a skill",
      "intro": "Compare the original intention with the observed change, then ask whether the unexpected effect could resolve a recurring difficulty in the failure library.",
      "figureCaption": "Figure 5. Pulling a sleeve also unfolds the body; pulling the hem only rotates the garment. Blue arrows show executed actions. The dashed outline in panel B marks the previous pose.",
      "cases": [
        {
          "id": "useful",
          "letter": "A",
          "label": "Useful surprise",
          "image": "public/images/surprise-useful.webp",
          "actionImage": "public/images/surprise-useful-action.webp",
          "checkImage": "public/images/surprise-useful-check.webp",
          "alt": "Figure 5A: pulling a sleeve also unfolds the collapsed body. This resolves a relevant difficulty, so the candidate is kept.",
          "actionAlt": "Original Figure 5A action and outcome: pulling the sleeve also unfolds the whole body.",
          "checkAlt": "Original Figure 5A failure check: the effect addresses a challenging configuration and is retained.",
          "intention": "“Pull the sleeve out.”",
          "effect": "The collapsed body also unfolds. This change goes beyond the stated intention.",
          "decision": "Keep the candidate: the effect addresses a challenging configuration in the failure library.",
          "verdict": "Keep"
        },
        {
          "id": "random",
          "letter": "B",
          "label": "Random surprise",
          "image": "public/images/surprise-random.webp",
          "actionImage": "public/images/surprise-random-action.webp",
          "checkImage": "public/images/surprise-random-check.webp",
          "alt": "Figure 5B: pulling the hem only rotates the shirt, without resolving a relevant difficulty. The candidate is discarded.",
          "actionAlt": "Original Figure 5B action and outcome: pulling the hem rotates the shirt. A dashed outline marks the previous pose.",
          "checkAlt": "Original Figure 5B failure check: the rotation does not resolve the relevant failures, so it is discarded.",
          "intention": "“Pull the hem out.”",
          "effect": "The shirt rotates, without resolving the relevant manipulation difficulty.",
          "decision": "Discard the candidate: surprise alone does not establish a reusable strategy.",
          "verdict": "Discard"
        }
      ],
      "detailsLabel": "How the paper describes a physical effect",
      "effectDescription": "An effect specifies a visually grounded region, an observable property, and its qualitative change.",
      "effectFields": [
        {
          "symbol": "r",
          "label": "Garment region"
        },
        {
          "symbol": "p",
          "label": "Observable property"
        },
        {
          "symbol": "δ",
          "label": "Qualitative change"
        }
      ],
      "effectExample": "For example, (left sleeve, exposure, ↑) means that the left sleeve becomes more visible."
    },
    "transfer": {
      "title": "Turn an effect into a rule that transfers",
      "intro": "The coding agent abstracts retained relationships into rules conditioned on visible garment structure. Similar candidates are consolidated while preserving their applicability constraints.",
      "schemaTitle": "What a skill contains",
      "fields": [
        {
          "symbol": "c",
          "subscript": "k",
          "title": "Applicability",
          "body": "Visible conditions that indicate when the skill can be used."
        },
        {
          "symbol": "σ",
          "subscript": "k",
          "title": "Manipulation strategy",
          "body": "How to choose a grasp, movement direction, and stopping condition from garment geometry."
        },
        {
          "symbol": "φ",
          "subscript": "k",
          "title": "Target effect",
          "body": "The physical change the skill is intended to produce."
        },
        {
          "symbol": "ℰ",
          "subscript": "k",
          "title": "Evidence & limitations",
          "body": "Supporting historical interactions and known limits of applicability."
        }
      ],
      "geometryTitle": "Ground each action in the current observation",
      "geometryBody": "Fold lines, free edges, and spatial relationships determine the action. The skill stores a reusable manipulation rule rather than fixed coordinates from one garment.",
      "deploymentBody": "At deployment, the base agent uses the current RGB observation, goal image, and skill descriptions. It checks applicability and instantiates a lift–pull–place action within the existing robot control interface.",
      "phases": [
        {
          "label": "Acquisition on G0"
        },
        {
          "label": "Freeze the library"
        },
        {
          "label": "Deployment on G1–G7"
        }
      ],
      "linkLabel": "Watch the four discovered skills"
    }
  },
  "opening": {
    "enabled": true,
    "autoplay": true,
    "duration": 8200,
    "phases": [
      "Mining experience",
      "Uncovering unexpected effects",
      "Discovering reusable skills",
      "GEM"
    ],
    "controls": {
      "pause": "Pause",
      "resume": "Resume",
      "skip": "Skip intro",
      "replay": "Replay intro"
    },
    "completeStatus": "Opening complete. GEM paper title and project content are now available."
  }
};
