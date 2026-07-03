# Tahoma2D Character Pipeline: Cyber-Onryō Geisha (Safe Horror)

This guide provides a **Tahoma2D-ready** workflow for creating a dark horror/cyberpunk geisha character as separate PNG parts (cutout animation), while avoiding explicit graphic gore.

## 1) Scope and style guardrails

- Visual direction: anime + cyberpunk + ghostly geisha + tragic horror mood.
- Allowed: eerie grin, scars, blood **stains/smudges** as stylized accents.
- Avoid: explicit dismemberment, exposed organs, graphic violence details.
- Keep every exported part on transparent background (`RGBA`, PNG).

## 2) Folder layout

```text
character_revenge_geisha/
  00_reference/
    style_board_notes.txt
    color_palette.png
  01_parts_png/
    head/
    face/
    torso/
    arms/
    legs/
    props/
    fx/
  02_templates/
    prompt_master.txt
    prompt_parts.txt
    layer_order.txt
  03_tahoma2d/
    scene/
    xsheet_notes.txt
```

## 3) File naming convention

Use lowercase snake_case:

`<group>_<side>_<variant>.png`

Examples:
- `head_base_v1.png`
- `eye_l_open.png`
- `eye_r_closed.png`
- `mouth_horror_grin_soft.png`
- `upper_arm_l_neutral.png`
- `hand_r_claw.png`
- `kimono_skirt_front_l.png`
- `shamisen_body_v1.png`

## 4) Core PNG part list (V1)

### Head + face
- `head_base_v1.png`
- `neck_v1.png`
- `hair_back_v1.png`
- `hair_front_main_v1.png`
- `hair_side_l_v1.png`
- `hair_side_r_v1.png`
- `eye_l_open.png`, `eye_l_half.png`, `eye_l_closed.png`
- `eye_r_open.png`, `eye_r_half.png`, `eye_r_closed.png`
- `brow_l_neutral.png`, `brow_l_angry.png`
- `brow_r_neutral.png`, `brow_r_angry.png`
- `mouth_neutral.png`, `mouth_open_small.png`, `mouth_horror_grin_soft.png`
- `scar_l_smileline.png`, `scar_r_smileline.png`

### Body
- `torso_kimono_upper_v1.png`
- `obi_front_v1.png`, `obi_back_v1.png`
- `collar_inner_v1.png`, `collar_outer_v1.png`
- `sleeve_l_upper_v1.png`, `sleeve_r_upper_v1.png`
- `kimono_skirt_front_l.png`, `kimono_skirt_front_r.png`, `kimono_skirt_back_v1.png`

### Limbs
- `upper_arm_l_neutral.png`, `lower_arm_l_neutral.png`
- `upper_arm_r_neutral.png`, `lower_arm_r_neutral.png`
- `hand_l_relaxed.png`, `hand_l_claw.png`
- `hand_r_relaxed.png`, `hand_r_claw.png`
- `thigh_l_neutral.png`, `calf_l_neutral.png`, `foot_l_neutral.png`
- `thigh_r_neutral.png`, `calf_r_neutral.png`, `foot_r_neutral.png`

### Props + FX
- `shamisen_body_v1.png`, `shamisen_neck_v1.png`, `shamisen_strings_v1.png`
- `mist_back_v1.png`, `mist_front_v1.png`, `shadow_ground_v1.png`, `lantern_glow_v1.png`

## 5) Layer order (back -> front)

1. `shadow_ground_v1`
2. `mist_back_v1`
3. `hair_back_v1`
4. `kimono_skirt_back_v1`
5. `torso_kimono_upper_v1`
6. `obi_back_v1`
7. legs (`thigh/calf/foot`)
8. arms (`upper/lower`) + sleeves
9. `neck_v1`
10. `head_base_v1`
11. scars + eyes + brows + mouth
12. front hair (`hair_side_*`, `hair_front_main_v1`)
13. `obi_front_v1`
14. front skirt pieces
15. hands
16. shamisen
17. `mist_front_v1`
18. `lantern_glow_v1`

## 6) Prompt templates (copy/paste)

### Master prompt

```text
anime horror cyberpunk geisha character sheet, ghostly onryo woman, pale skin, very long black hair, torn black and dark red kimono, subtle traditional patterns, eerie elegant mood, 3/4 view, clean lineart, transparent background, isolated puppet-ready body part, consistent lighting, no background
```

### Part prompt template

```text
[PART NAME], for the same anime cyber-onryo geisha character, 3/4-compatible, transparent background, isolated cutout for 2D rigging, consistent lineart and color palette, non-graphic horror style
```

### Negative prompt template

```text
background, extra limbs, extra fingers, fused anatomy, photo-realistic skin, heavy gore, exposed organs, dismemberment, text, watermark, logo, blurry edges, inconsistent perspective
```

## 7) Tahoma2D usage workflow

1. Generate/export all parts in one fixed canvas size (example: `2048x2048`).
2. Align all parts to the same body center before export.
3. Import as level sequence (`File > Load Level`) in Tahoma2D.
4. Create peg hierarchy:
   - root -> torso -> neck -> head -> face parts
   - torso -> arm_l chain / arm_r chain
   - torso -> leg_l chain / leg_r chain
5. Set pivot points at joints (shoulder, elbow, wrist, hip, knee, ankle).
6. Test baseline motion:
   - blink cycle
   - subtle breathing
   - sleeve sway
   - slow head tilt
7. Add FX layers last (mist/lantern glow) and animate with low opacity changes.

## 8) Quick production checklist

- [ ] Every part is transparent PNG.
- [ ] Line thickness and lighting are consistent.
- [ ] Left/right limb naming is consistent (`_l_` / `_r_`).
- [ ] No explicit graphic gore content.
- [ ] Tahoma2D pivots set and tested.
- [ ] V1 idle animation exports successfully.
