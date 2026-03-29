const ATTRIBUTE_SCHEMA = {
  spatial: ["Position", "Orientation", "Size", "Other"],
  geometry: ["Shape", "Surface", "Other"],
  material: {
    categories: ["Simple Materials", "Material Transformations", "Other"],
    properties: [
      "Color / Pattern", "Surface Texture", "Reflectance",
      "Opacity / Refraction", "Emission", "Organic Properties", "Other"
    ]
  },
  structural: [
    "Stretch", "Twist", "Fold / Unfold", "Segment / Cut", "Compress",
    "Inflate / Deflate", "Bend", "Break / Shatter", "Shrink", "Other"
  ],
  groups: ["Count", "Density", "Spatial Arrangement - Alignment", "Spatial Arrangement - Stacking", "Spatial Arrangement - Packing", "Spatial Arrangement - Geographical", "Spatial Arrangement - Concentration", "Spatial Arrangement - Scattering", "Spatial Arrangement - Path", "Spatial Arrangement - Other", "Other"],
  //layout: ["Spatial Topology", "Stacking", "Concentration", "Scattering", "Path", "Packing", "Other"],
  framing: ["Lighting", "Camera", "Environment / Background", ,"Other"],
  // animation: [
  //   "Transitions", "Animated Spatial Attributes", "Animated Geometry Attributes",
  //   "Animated Material Attributes", "Animated Structural Attributes",
  //   "Animated Populations and Distributions", "Cinematics", "Other"
  // ],
  time: [],
  other: ["Other"]
};

const MECH_ICONS = {
  mechanism:  "icons/mechanism.png",   // default gear (unselected)
  biological: "icons/biological.png",
  physics:    "icons/physics.png",
  //artificial: "icons/artificial.png",
};

const MECH_SUBCATS = {
  biological: ['Growth','Decay','Living Movement','Respiration & Rhythms','Infection','Self-onrganization & Patterns','Life-Cycle Events','Other'],
  physics:    ['Rigid-Body Mechanics','Deformable Solid Mechanics','Fluids','Burning & Fire','State Change', 'Force Fields & Particles','Wind', 'Waves & Oscillations', 'Optics', 'Weathering','Beyond-Physics','Other']
  //artificial: ['Mechanical Systems','Devices & Robotics']
};

const METADATA_SCHEMA = {
  metadataVisInfo: [
    //{ label: "Physicality", id: "physicality", options: ["Digital", "Physical", "Hybrid", "Unknown"] },
    { label: "Audience", id: "audience", allowMultiple: true, options: ["Experts", "General public", "Unknown"] },
    { label: "Viewing Context", id: "viewingContext", allowMultiple: true, options: ["Internet / Digital Application", "Public space", "Print media", "Other", "Unknown"] },
    { label: "Data Theme", id: "dataTheme", allowMultiple: true, options: ["Environment & Climate", "Health & Medicine", "Demographics & Population", "Economics & Finance", "Social Issues", "Science & Research", "Technology", "Art & Culture", "Politics & Governance", "Education","Sports", "Personal or Quantified Self", "History", "Other", "Unknown"] },
    { label: "Communicative Intent", id: "intent", allowMultiple: true, options: ["Inform / Educate / Discover", "Emote / Provoke", "Entertain", "Other", "Unknown"] },
    {
      label: "Method of Making",
      id: "methodOfMaking",
      options: [
        "3D render",
        "Photograph of physical artefact",
        "Graphic design - Illustration",
        "Other",
        "Unknown"
      ],
      nested: {
        "3D render": {
          techniques: ["Sculpting", "Procedural Modeling", "Physically-based Rendering", "Simulations", "Other", "Unknown"],
          software: ["Blender", "Houdini", "Cinema4D", "Web 3D", "Unreal Engine", "Other", "Unknown"]
        },
        "Graphic design - Illustration": {
          technique: ["Made with digital tools", "Made with physical tools", "Unknown"]
        },
        "Other": {
          specify: true
        }
      }
    }
  ],
  // metadataRealism: [
  //   { label: "Perceptual Realism", id: "perceptualRealism", options: ["Low", "Intermediate", "High", "Very high"] },
  //   { label: "Representation Abstraction", id: "abstraction", options: ["Low (Figurative)", "Intermediate (Mixed)", "High (Abstract)"] }
  // ],
  metadataSubjective: [
    { label: "Haptics", id: "haptics", options: ["None", "Low", "Intermediate", "High"] },
    { label: "Smell", id: "smell", options: ["None", "Low", "Intermediate", "High"] },
    { label: "Taste", id: "taste", options: ["None", "Low", "Intermediate", "High"] },
    { label: "Sound", id: "sound", options: ["None", "Low", "Intermediate", "High"] },
    { label: "Emotional Reinforcement", id: "emotion", options: ["Low", "Intermediate", "High"] }
  ]
};

const ATTRIBUTE_ICONS = {
  spatial: "icons/spatial.png",
  geometry: "icons/shape.png",
  material: "icons/material.png",
  structural: "icons/structural.png",
  groups: "icons/populations.png",
  //layout: "icons/layout.png",
  framing: "icons/framing.png",
  animation: "icons/animation.png",
  biological: "icons/biological.png",
  physics: "icons/physics.png",
  time: "icons/progression.png",
  context: "icons/context.png"
};

let currentCropper = null;

//const MULTI_METADATA_FIELDS = ["audience", "viewingContext", "dataTheme", "intent"];

//document.getElementById("addElement").addEventListener("click", () => addVisualElement());

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("dataVariableInput");
  const tagList = document.querySelector(".data-variable-tags");

  if (!input || !tagList) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const tag = createDataVariableTag(input.value.trim());
      tagList.appendChild(tag);
      input.value = "";
    }
    refreshAllDataVariableDropdowns();
  });
});

document.getElementById("addElement").addEventListener("click", () => {
  const img = document.getElementById("uploadedImage");
  if (!img.src) return alert("Please upload an image first.");

  // Show modal
  const modal = document.getElementById("cropModal");
  const cropImg = document.getElementById("cropImage");
  cropImg.src = img.src;
  modal.style.display = "flex";

  // Init cropper
  currentCropper?.destroy?.();
  currentCropper = new Cropper(cropImg, {
    viewMode: 1,
    aspectRatio: NaN
  });

  // Confirm crop
  document.getElementById("confirmCrop").onclick = () => {
    const croppedCanvas = currentCropper.getCroppedCanvas();
    const croppedDataUrl = croppedCanvas.toDataURL("image/png");
    modal.style.display = "none";
    currentCropper.destroy();
    currentCropper = null;

    addVisualElement({ thumbnail: croppedDataUrl });
  };

  document.getElementById("cancelCrop").onclick = () => {
    modal.style.display = "none";
    currentCropper.destroy();
    currentCropper = null;
  };
});

document.getElementById("importJson").addEventListener("change", handleImport);

document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("imageInput");
  const uploadedImage = document.getElementById("uploadedImage");

  if (imageInput && uploadedImage) {
    imageInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }
});

function createCommentToggle(commentElement, initialVisible = false) {
  const toggle = document.createElement("span");
  toggle.textContent = "💬";
  toggle.title = "Add comment";
  toggle.className = "comment-toggle";
  
  if (initialVisible) {
    toggle.classList.add("active");
    commentElement.style.display = "block";
  } else {
    commentElement.style.display = "none";
  }

  toggle.addEventListener("click", () => {
    const isVisible = commentElement.style.display === "block";
    commentElement.style.display = isVisible ? "none" : "block";
    toggle.classList.toggle("active", !isVisible);
  });

  return toggle;
}

function resetInfoAndMetadata() {
  // Top info
  ["titleInput", "idInput", "presentationSelect", "linkInput", "descriptionInput"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "SELECT") {
      // ensure a blank placeholder exists
      if (![...el.options].some(o => o.value === "")) {
        const ph = new Option("Please select...", "");
        ph.disabled = true; ph.selected = true;
        el.insertBefore(ph, el.firstChild);
      }
      el.value = "";
    } else {
      el.value = "";
    }
  });

  // Metadata selects
  Object.values(METADATA_SCHEMA).flat().forEach(field => {
    const sel = document.getElementById(field.id);
    if (!sel) return;
    if (field.allowMultiple) {
      Array.from(sel.options).forEach(o => (o.selected = false));
    } else {
      sel.value = "";
    }
  });

  // Nested technique/software/etc. and comments
  document.querySelectorAll(".metadata-panel [data-role]").forEach(s => (s.value = ""));
  document.querySelectorAll(".metadata-panel textarea").forEach(t => { t.value = ""; t.style.display = "none"; });
  document.querySelectorAll(".metadata-panel .comment-toggle").forEach(t => t.classList.remove("active"));
}

///////////////////////////////////////////////////////////// import //////////////////////////////////////////////////////////////

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => loadExampleData(JSON.parse(e.target.result));
  reader.readAsText(file);
}

function loadExampleData(data) {
  resetInfoAndMetadata();

  // document.getElementById("coderSelect").value = data.coder || "";
  document.getElementById("titleInput").value = data.title || "";
  document.getElementById("idInput").value = data.id || "";
  document.getElementById("presentationSelect").value = data.presentation || "";
  document.getElementById("linkInput").value = data.link || "";
  document.getElementById("descriptionInput").value = data.description || "";

  // 1. Load tags first
  if (Array.isArray(data.dataVariables)) {
    const tagList = document.querySelector(".data-variable-tags");
    if (tagList) {
      tagList.innerHTML = "";
      data.dataVariables.forEach(varName => {
        const tag = createDataVariableTag(varName);
        tagList.appendChild(tag);
      });
    }
    refreshAllDataVariableDropdowns();
  }

  // Clear visual elements
  document.getElementById("container").innerHTML = "";
  data.visualElements?.forEach(el => {
    addVisualElement({ ...el, thumbnail: el.thumbnail || "" });
  });

  if (data.image) {
    const img = document.getElementById("uploadedImage");
    img.src = data.image;
    img.style.display = "block";
    window._imageDataUrl = data.image;
  }

  // Populate metadata if present
  if (!data.metadata) return;

  Object.entries(METADATA_SCHEMA).forEach(([sectionId, fields]) => {
    const sectionData = data.metadata[sectionId] || {};

    // First pass: standard fields
    fields.filter(f => !f.allowMultiple).forEach(field => {
      const fieldData = sectionData[field.label];
      if (!fieldData) return;

      const value = fieldData.value || "";
      const comment = fieldData.comment || "";

      const select = document.getElementById(field.id);
      const row = select?.closest("div");
      const textarea = row?.parentElement?.querySelector("textarea");

      if (select) {
        select.value = value;
        select.dispatchEvent(new Event("change"));

        // Load nested fields
        setTimeout(() => {
          const panel = select.closest(".metadata-panel");

          if (value === "3D render") {
            const tech = panel.querySelector('[data-role="techniques"]');
            const soft = panel.querySelector('[data-role="software"]');
            if (tech) tech.value = fieldData.techniques || "";
            if (soft) soft.value = fieldData.software || "";
          }

          if (value === "Graphic design - Illustration") {
            const technique = panel.querySelector('[data-role="technique"]');
            if (technique) technique.value = fieldData.technique || "";
          }
        }, 0);
      }

      if (textarea) {
        textarea.value = comment;
        if (comment.trim()) {
          textarea.style.display = "block";
          const toggle = row?.querySelector("span");
          if (toggle) toggle.classList.add("active");
        }
      }
    });

    // Second pass: multiple-selection fields
    fields.filter(f => f.allowMultiple).forEach(field => {
      const fieldData = sectionData[field.label];
      if (!fieldData) return;

      const values = Array.isArray(fieldData.value) ? fieldData.value : [];
      const comment = fieldData.comment || "";

      const select = document.getElementById(field.id);
      const row = select?.closest("div");
      const textarea = row?.parentElement?.querySelector("textarea");

      if (select && values.length) {
        Array.from(select.options).forEach(option => {
          option.selected = values.includes(option.value);
        });
      }

      if (textarea) {
        textarea.value = comment;
        if (comment.trim()) {
          textarea.style.display = "block";
          const toggle = row?.querySelector("span");
          if (toggle) toggle.classList.add("active");
        }
      }
    });
  });
}

////////////////////////////////////////////////////////// add visual elements /////////////////////////////////////////////////////


// ------------------------------ Compound helpers (Option 1: compound chip/dropdown) ------------------------------
function getCompoundIdsInElement(elementWrapper) {
  const ids = new Set();
  if (!elementWrapper) return [];
  elementWrapper.querySelectorAll(".attr-item").forEach((it) => {
    const v = it.dataset.compoundId;
    if (!v) return;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) ids.add(n);
  });
  return Array.from(ids).sort((a, b) => a - b);
}

function initNextCompoundId(elementWrapper) {
  if (!elementWrapper) return 1;
  if (elementWrapper.dataset.nextCompoundId) {
    const cur = parseInt(elementWrapper.dataset.nextCompoundId, 10);
    return Number.isNaN(cur) ? 1 : cur;
  }
  const ids = getCompoundIdsInElement(elementWrapper);
  const max = ids.length ? Math.max(...ids) : 0;
  const next = max + 1;
  elementWrapper.dataset.nextCompoundId = String(next > 0 ? next : 1);
  return parseInt(elementWrapper.dataset.nextCompoundId, 10);
}

function applyCompoundStyle(attrItem) {
  if (!attrItem) return;
  const v = attrItem.dataset.compoundId;
  if (v) {
    const n = parseInt(v, 10);
    // Prefer a fixed palette for the first compounds (requested), then fall back to a generated hue.
    const PRIMARY_BUNDLE_COLORS = ["#3f4adb", "#ebb44d"];

    const hexToRgba = (hex, a) => {
      // hex like #RRGGBB
      const h = (hex || "").replace("#", "");
      if (h.length !== 6) return `rgba(255,255,255,${a})`;
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    };

    let borderColor = "";
    let bgColor = "";

    if (!Number.isNaN(n) && n >= 1 && n <= PRIMARY_BUNDLE_COLORS.length) {
      borderColor = PRIMARY_BUNDLE_COLORS[n - 1];
      bgColor = hexToRgba(borderColor, 0.08);
    } else {
      const hue = Number.isNaN(n) ? 200 : (n * 47) % 360;
      borderColor = `hsl(${hue} 70% 55%)`;
      bgColor = `hsla(${hue} 70% 55% / 0.08)`;
    }

    attrItem.classList.add("is-compoundd");
    attrItem.style.borderLeft = `4px solid ${borderColor}`;
    attrItem.style.background = bgColor;
    attrItem.style.borderRadius = "10px";
    attrItem.style.paddingLeft = "6px";
  } else {
    attrItem.classList.remove("is-compoundd");
    attrItem.style.borderLeft = "";
    attrItem.style.background = "";
    attrItem.style.borderRadius = "";
    attrItem.style.paddingLeft = "";
  }
}

function refreshCompoundSelects(elementWrapper) {
  if (!elementWrapper) return;
  const ids = getCompoundIdsInElement(elementWrapper);

  elementWrapper.querySelectorAll(".compound-select").forEach((sel) => {
    const attrItem = sel.closest(".attr-item");
    const cur = attrItem?.dataset?.compoundId || "";

    sel.innerHTML = "";
    sel.appendChild(new Option("Simple Attribute", ""));
    sel.appendChild(new Option("New Compound…", "__new__"));
    ids.forEach((id) => sel.appendChild(new Option(`C${id}`, String(id))));

    // Keep selection in sync with the row's dataset
    const curStr = cur ? String(cur) : "";
    sel.value = ids.map(String).includes(curStr) ? curStr : "";
  });
}


// ------------------------------ Compound sync (Option 1: shared fields within a compound) ------------------------------
let __compoundSyncLock = false;

function _getCompoundIdFromAttrItem(attrItem) {
  const v = (attrItem && attrItem.dataset) ? (attrItem.dataset.compoundId || "") : "";
  const n = parseInt(v, 10);
  return v && !Number.isNaN(n) ? String(n) : "";
}

function getCompoundMembers(elementWrapper, compoundIdStr) {
  if (!elementWrapper || !compoundIdStr) return [];
  return Array.from(elementWrapper.querySelectorAll(".attr-item"))
    .filter(it => _getCompoundIdFromAttrItem(it) === String(compoundIdStr));
}

function readSharedCompoundState(attrItem) {
  const row = attrItem ? attrItem.querySelector(".attribute-row") : null;
  const dataVar = row && row.querySelector(".data-variable-dropdown") ? row.querySelector(".data-variable-dropdown").value : "";
  const sem = row && row.querySelector(".semantic-congruence-dropdown") ? row.querySelector(".semantic-congruence-dropdown").value : "";

  return {
    dataVariable: dataVar,
    semanticCongruence: sem,
  };
}

function applySharedCompoundState(attrItem, state) {
  const row = attrItem ? attrItem.querySelector(".attribute-row") : null;
  if (!row || !state) return;

  const dv = row.querySelector(".data-variable-dropdown");
  if (dv && dv.value !== (state.dataVariable || "")) dv.value = state.dataVariable || "";

  const sem = row.querySelector(".semantic-congruence-dropdown");
  if (sem && sem.value !== (state.semanticCongruence || "")) sem.value = state.semanticCongruence || "";

  // const mechRoot = row.querySelector(".mechanism-root");
  // if (mechRoot && mechRoot.__mechApi && typeof mechRoot.__mechApi.setValue === "function") {
  //   const desiredCat = state.mechanismCategory && state.mechanismCategory !== "none" ? state.mechanismCategory : null;
  //   const desiredSub = desiredCat ? (state.mechanismSubcategory || "") : "";
  //   mechRoot.__mechApi.setValue(desiredCat, desiredSub);
  // } else if (mechRoot) {
  //   // Fallback: update datasets (UI may not fully update without API)
  //   mechRoot.dataset.mechanismCategory = state.mechanismCategory || "none";
  //   mechRoot.dataset.mechanismSubcat = (state.mechanismCategory && state.mechanismCategory !== "none") ? (state.mechanismSubcategory || "") : "";
  // }
}

function propagateCompoundStateFrom(attrItem) {
  if (__compoundSyncLock) return;
  const elementWrapper = attrItem ? attrItem.closest(".element-wrapper") : null;
  const compoundId = _getCompoundIdFromAttrItem(attrItem);
  if (!elementWrapper || !compoundId) return;

  const state = readSharedCompoundState(attrItem);
  const peers = getCompoundMembers(elementWrapper, compoundId).filter(it => it !== attrItem);
  if (!peers.length) return;

  __compoundSyncLock = true;
  try {
    peers.forEach(p => applySharedCompoundState(p, state));
  } finally {
    __compoundSyncLock = false;
  }
}

function syncThisFromExistingCompound(attrItem) {
  const elementWrapper = attrItem ? attrItem.closest(".element-wrapper") : null;
  const compoundId = _getCompoundIdFromAttrItem(attrItem);
  if (!elementWrapper || !compoundId) return;

  const members = getCompoundMembers(elementWrapper, compoundId).filter(it => it !== attrItem);
  if (!members.length) return;

  __compoundSyncLock = true;
  try {
    const leaderState = readSharedCompoundState(members[0]);
    applySharedCompoundState(attrItem, leaderState);
  } finally {
    __compoundSyncLock = false;
  }
}


function addVisualElement(data = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "element-wrapper";
  // Compound IDs are local per visual element
  wrapper.dataset.nextCompoundId = "1";

  const topRow = document.createElement("div");
  topRow.style.display = "flex";
  topRow.style.gap = "15px";

  // Thumbnail (left side)
  const thumbnailWrapper = document.createElement("div");
  thumbnailWrapper.style.display = "flex";
  thumbnailWrapper.style.alignItems = "center";
  thumbnailWrapper.style.flexShrink = "0";

  if (data.thumbnail) {
    const thumb = document.createElement("img");
    thumb.src = data.thumbnail;
    thumb.alt = "Cropped area";
    thumb.style.width = "auto";
    thumb.style.minWidth = "110px";  /* ← min size cap */
    thumb.style.minHeight = "110px"; /* ← min size cap */
    thumb.style.maxWidth = "270px";  /* ← max width cap */
    thumb.style.maxHeight = "270px"; /* ← max height cap */
    thumb.style.objectFit = "contain";
    thumb.style.display = "block";
    thumb.style.border = "1px solid #ccc";
    thumb.style.borderRadius = "6px";
    thumbnailWrapper.appendChild(thumb);
  }

  // Inputs (right side)
  const inputWrapper = document.createElement("div");
  inputWrapper.style.flex = "1";
  inputWrapper.style.display = "flex";
  inputWrapper.style.flexDirection = "column";
  inputWrapper.style.gap = "8px";

  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.alignItems = "center";
  headerRow.style.gap = "10px";

  const styleRow = document.createElement("div");
  styleRow.style.display = "flex";
  styleRow.style.alignItems = "center";
  styleRow.style.gap = "10px";

  const semanticRow = document.createElement("div");
  semanticRow.style.display = "flex";
  semanticRow.style.alignItems = "center";
  semanticRow.style.gap = "10px";

  const description = document.createElement("input");
  description.placeholder = "Description";
  description.value = data.description || "";
  description.style.flex = "6";

  const elementType = document.createElement("select");
  elementType.innerHTML = "<option value=''>Select Element Type</option>";
  ["Mark","Mark + Unit", "Collection", "Annotation","Guide","Decoration","Scene"].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    elementType.appendChild(option);
  });
  elementType.classList.add("element-type");
  elementType.value = data.elementType || "";
  elementType.style.flex = "2";


  const elementDistData = document.createElement("select");
  elementDistData.innerHTML = "<option value=''>Select Metaphorical Proximity to Data</option>";
  const optionsDistData = [
    { value: "Low", label: "Low Proximity (Symbolic)" },
    { value: "Intermediate", label: "Intermediate Proximity (Iconic)" },
    { value: "High", label: "High Proximity (Literal)" },
  ];
  optionsDistData.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;        // ✅ saved in JSON
    option.textContent = label;  // ✅ shown in the dropdown
    elementDistData.appendChild(option);
  });
  elementDistData.classList.add("element-distdata");
  elementDistData.value = data.elementDistData || "";
  elementDistData.style.flex = "2";

  const elementDistDataWrap = document.createElement("div");
  elementDistDataWrap.classList.add("select-with-icon");
  elementDistDataWrap.style.flex = "2"; // keep same layout behavior as before

  const dataIcon = document.createElement("span");
  dataIcon.classList.add("select-icon", "data");

  elementDistData.style.flex = ""; // optional: let wrapper control sizing
  elementDistDataWrap.appendChild(dataIcon);
  elementDistDataWrap.appendChild(elementDistData);

  const elementDistReality = document.createElement("select");
  elementDistReality.innerHTML = "<option value=''>Select Real-World Familiarity</option>";
  const optionsDistReality = [
  { value: "Low",          label: "Low Familiarity" },
  { value: "Intermediate", label: "Intermediate Familiarity" },
  { value: "High",         label: "High Familiarity" },
  ];
  optionsDistReality.forEach(({ value, label }) => {
  const option = document.createElement("option");
  option.value = value;        // ✅ saved in JSON
  option.textContent = label;  // ✅ shown to the user
  elementDistReality.appendChild(option);
  });
  elementDistReality.value = data.elementDistReality || "";
  elementDistReality.classList.add("element-distreality");
  elementDistReality.style.flex = "2";

  const elementDistRealityWrap = document.createElement("div");
  elementDistRealityWrap.classList.add("select-with-icon");
  elementDistRealityWrap.style.flex = "2";

  const realityIcon = document.createElement("span");
  realityIcon.classList.add("select-icon", "reality");

  elementDistReality.style.flex = ""; // optional
  elementDistRealityWrap.appendChild(realityIcon);
  elementDistRealityWrap.appendChild(elementDistReality);

  const elementPerceptualRealism = document.createElement("select");
  elementPerceptualRealism.innerHTML = "<option value=''>Select Perceptual Realism</option>";
  const optionsPerceptualRealism = [
    { value: "Low",          label: "Low (Highly Stylized)" },
    { value: "Intermediate", label: "Intermediate (Mixed Realism)" },
    { value: "High",         label: "High (Visually Realistic)" },
  ];
  optionsPerceptualRealism.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;        // ✅ saved in JSON
    option.textContent = label;  // ✅ shown in the dropdown
    elementPerceptualRealism.appendChild(option);
  });
  elementPerceptualRealism.classList.add("element-perceptualrealism");
  elementPerceptualRealism.value = data.elementPerceptualRealism || "";
  elementPerceptualRealism.style.flex = "";

  const elementPerceptualRealismWrap = document.createElement("div");
  elementPerceptualRealismWrap.classList.add("select-with-icon");
  elementPerceptualRealismWrap.style.flex = "2";

  const realismIcon = document.createElement("span");
  realismIcon.classList.add("select-icon", "realism");

  elementPerceptualRealismWrap.appendChild(realismIcon);
  elementPerceptualRealismWrap.appendChild(elementPerceptualRealism);

  const elementHierarchy = document.createElement("select");
  elementHierarchy.innerHTML = "<option value=''>Select Hierarchy</option>";
  ["1", "2", "3","4","5","No hierarchy"].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    elementHierarchy.appendChild(option);
  });
  elementHierarchy.classList.add("element-hierarchy");
  elementHierarchy.value = data.elementHierarchy || "";
  elementHierarchy.style.flex = "1";

  const generalComment = document.createElement("textarea");
  generalComment.placeholder = "Comment about this visual element...";
  generalComment.style.display = data.comment ? "block" : "none";
  if (data.comment) generalComment.value = data.comment;

  const toggleComment = createCommentToggle(generalComment, !!data.comment);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete this visual element";
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.remove();
  });

  headerRow.appendChild(description);
  styleRow.appendChild(elementType);
  styleRow.appendChild(elementHierarchy);
  semanticRow.appendChild(elementPerceptualRealismWrap);
  semanticRow.appendChild(elementDistRealityWrap);
  semanticRow.appendChild(elementDistDataWrap);
  semanticRow.appendChild(toggleComment);
  headerRow.appendChild(deleteBtn);

  inputWrapper.appendChild(headerRow);
  inputWrapper.appendChild(styleRow);
  inputWrapper.appendChild(semanticRow);
  inputWrapper.appendChild(generalComment);

  topRow.appendChild(thumbnailWrapper);
  topRow.appendChild(inputWrapper);
  wrapper.appendChild(topRow);

  // Visual Channels
  const visualContainer = document.createElement("div");
  visualContainer.className = "attribute-container";
  const visualSection = createAttributeSection("Data-encoding Attributes", visualContainer);
  wrapper.appendChild(visualSection);

  // Contextual Attributes
  const contextualContainer = document.createElement("div");
  contextualContainer.className = "attribute-container";
  const contextualSection = createAttributeSection("Contextual Attributes", contextualContainer);
  wrapper.appendChild(contextualSection);

  document.getElementById("container").appendChild(wrapper);

  if (Array.isArray(data.visualChannels)) {
    data.visualChannels.forEach(attr => addAttribute(visualContainer, attr, true));
  }

  if (Array.isArray(data.contextualAttributes)) {
    data.contextualAttributes.forEach(attr => addAttribute(contextualContainer, attr));
  }

  // Initialize compound counter from imported data (if any) and sync compound UI
  initNextCompoundId(wrapper);
  refreshCompoundSelects(wrapper);
  wrapper.querySelectorAll(".attr-item").forEach(applyCompoundStyle);
}

//////////////////////////////////////////////////// add attribute ///////////////////////////////////////////////////////////////

function createAttributeSection(labelText, container) {
  const sectionWrapper = document.createElement("div");
  sectionWrapper.style.marginTop = "15px";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.className = "category-header";

  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.type = "button";
  addBtn.className = "add-attribute-button";
  addBtn.style.marginLeft = "10px";
  addBtn.addEventListener("click", () => {
    const isVisual = labelText.toLowerCase().includes("data-encoding");
    addAttribute(container, {}, isVisual);
  });

  sectionWrapper.appendChild(label);
  sectionWrapper.appendChild(addBtn);
  sectionWrapper.appendChild(container);
  return sectionWrapper;
}

function addAttribute(container, data = {}, isVisual = false) {
  const row = document.createElement("div");
  row.className = "attribute-row";

  // Dropdown + icon
  const typeSelect = document.createElement("select");
  typeSelect.innerHTML = "<option value=''>Select Attribute Type</option>";
  //typeSelect.style.flex = "0 0 150px";
  typeSelect.classList.add("attribute-type-select");

  Object.keys(ATTRIBUTE_SCHEMA).forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    var label = type.charAt(0).toUpperCase() + type.slice(1);
    if(label == "Groups"){label = "Groups & Populations";}
    option.textContent = label;
    typeSelect.appendChild(option);
  });

  const iconPreview = document.createElement("img");
  iconPreview.className = "attribute-icon";

  if (ATTRIBUTE_ICONS[typeSelect.value]) {
    iconPreview.src = ATTRIBUTE_ICONS[typeSelect.value];
  }

  typeSelect.addEventListener("change", () => {
    iconPreview.src = ATTRIBUTE_ICONS[typeSelect.value] || "";
  });

  const selectWrapper = document.createElement("div");
  selectWrapper.style.display = "flex";
  selectWrapper.style.alignItems = "center";
  selectWrapper.style.gap = "6px";
  selectWrapper.appendChild(iconPreview);
  selectWrapper.appendChild(typeSelect);

  row.appendChild(selectWrapper);

  // Subfield container
  const subContainer = document.createElement("div");
  //subContainer.style.flex = "0 0 auto";
  subContainer.classList.add("attribute-subcategory-select");
  row.appendChild(subContainer);

  const animBtn = createIconToggle({
    iconSrc: ATTRIBUTE_ICONS.animation,
    alt: "Animated",
    initial: data?.animated === true,
    titleOn: "Animated",
    titleOff: "Not animated",
    className: "anim-btn",
    stateTarget: row,
    datasetKey: "animated",
    pressedClass: "is-animated",
  });
  //row.prepend(animBtn);

  row.appendChild(animBtn);

  if (isVisual) {
    const dataVarSelect = document.createElement("select");
    dataVarSelect.classList.add("data-variable-dropdown");
    dataVarSelect.style.minWidth = "150px";
    dataVarSelect.style.flex = "1";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Select Data Variable";
    dataVarSelect.appendChild(defaultOpt);

    // Get available tags from global tag list
    const globalTags = document.querySelectorAll(".data-variable-tag");
    globalTags.forEach(tag => {
      const option = document.createElement("option");
      option.value = tag.textContent;
      option.textContent = tag.textContent;
      dataVarSelect.appendChild(option);
    });

    // Pre-select if editing
    if (data.dataVariable) {
      dataVarSelect.value = data.dataVariable;
    }

    // Semantic congruence dropdown (replaces Supports Context toggle)
const semanticSelect = document.createElement("select");
semanticSelect.classList.add("semantic-congruence-dropdown");
semanticSelect.style.minWidth = "50px";
semanticSelect.style.flex = "0.45";

const semDefault = document.createElement("option");
semDefault.value = "";
semDefault.textContent = "Semantic congruence";
semanticSelect.appendChild(semDefault);

[
  { value: "weak", text: "Weak Congruence" },
  { value: "intermediate", text: "Intermediate Congruence" },
  { value: "strong", text: "Strong Congruence" },
].forEach(({ value, text }) => {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = text;
  semanticSelect.appendChild(opt);
});

// Pre-select if editing / importing (supports backward compatibility)
let initialSemantic = "";
if (typeof data?.semanticCongruence === "string") {
  const v = data.semanticCongruence.trim().toLowerCase();
  if (["weak", "intermediate", "strong"].includes(v)) initialSemantic = v;
} else if (typeof data?.contextualSupport === "string") {
  const v = data.contextualSupport.trim().toLowerCase();
  if (["weak", "intermediate", "strong"].includes(v)) initialSemantic = v;
  if (v === "supports" || v === "supports context") initialSemantic = "strong";
} else if (data?.contextualSupport === true || data?.supportsContext === true) {
  initialSemantic = "strong";
}
if (initialSemantic) semanticSelect.value = initialSemantic;


    dataVarSelect.addEventListener("change", () => {
      if (!__compoundSyncLock) propagateCompoundStateFrom(wrapper);
    });
    semanticSelect.addEventListener("change", () => {
      if (!__compoundSyncLock) propagateCompoundStateFrom(wrapper);
    });

row.appendChild(dataVarSelect);
row.appendChild(semanticSelect);
}

  //const init = (typeof values !== "undefined" && values) || (typeof data !== "undefined" && data) || {};

  const mech = createMechanismControl({
    initialCategory:
      (data?.mechanismCategory && data.mechanismCategory !== "none")
        ? data.mechanismCategory
        : null,
    initialSubcat: data?.mechanismSubcategory || "",
    // onChange: () => {
    //   if (!__compoundSyncLock) propagateCompoundStateFrom(wrapper);
    // }
    onChange: () => {}
  });
  // Keep an API handle on the DOM for compound syncing
  mech.root.__mechApi = mech;
  row.appendChild(mech.root);

  // Comment toggle + box
  const commentBox = document.createElement("textarea");
  commentBox.placeholder = "Comment about this attribute...";
  commentBox.style.flex = "1";
  //commentBox.style.minHeight = "16px";

  const wrapper = document.createElement("div");
  wrapper.className = "attr-item"; // optional

  // Compound selector (Option 1)
  const elementWrapper = container.closest(".element-wrapper");
  if (elementWrapper) initNextCompoundId(elementWrapper);

  // Store compound id on the attribute wrapper for export/import
  wrapper.dataset.compoundId = (data && data.compoundId !== undefined && data.compoundId !== null && data.compoundId !== "")
    ? String(data.compoundId)
    : "";

  const compoundSelect = document.createElement("select");
  compoundSelect.classList.add("compound-select");
  // Compact width so it stays inline with other controls (height comes from existing CSS)
  compoundSelect.style.width = "78px";
  compoundSelect.style.minWidth = "78px";
  compoundSelect.style.maxWidth = "78px";
  compoundSelect.style.flex = "0 0 auto";

  // We'll fill options after inserting into the DOM (so refreshCompoundSelects can see it)
  compoundSelect.addEventListener("change", () => {
    const elWrap = container.closest(".element-wrapper");
    if (!elWrap) return;

    initNextCompoundId(elWrap);

    if (compoundSelect.value === "__new__") {
      const cur = parseInt(elWrap.dataset.nextCompoundId || "1", 10) || 1;
      wrapper.dataset.compoundId = String(cur);
      elWrap.dataset.nextCompoundId = String(cur + 1);
    } else {
      wrapper.dataset.compoundId = compoundSelect.value || "";
    }

    
    // If joining an existing compound, align this attribute's shared fields to the compound leader
    if (wrapper.dataset.compoundId) {
      syncThisFromExistingCompound(wrapper);
    }

    refreshCompoundSelects(elWrap);
    applyCompoundStyle(wrapper);

  });

  const toggleComment = createCommentToggle(commentBox, !!data.comment);

  row.appendChild(compoundSelect);
  row.appendChild(toggleComment);
  //row.appendChild(commentBox);


  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("row-delete"); 
  deleteBtn.textContent = "❌";
  deleteBtn.title = "Delete this attribute";
  deleteBtn.style.padding = "4px 8px";
  deleteBtn.style.backgroundColor = "transparent";
  deleteBtn.style.border = "none";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "10px";
  deleteBtn.addEventListener("click", () => {
    const elWrap = container.closest(".element-wrapper");
    wrapper.remove();
    if (elWrap) refreshCompoundSelects(elWrap);
  });

  row.appendChild(deleteBtn);

  wrapper.appendChild(row);
  wrapper.appendChild(commentBox);
  container.appendChild(wrapper);

  // Sync compound dropdown options and styling now that the row is in the DOM
  if (elementWrapper) refreshCompoundSelects(elementWrapper);
  applyCompoundStyle(wrapper);

  // If this attribute is already part of a compound (import), align shared fields to the existing compound leader
  if (wrapper.dataset.compoundId) {
    syncThisFromExistingCompound(wrapper);
  }

  placeAttrArea(row);

  if (isVisual) {
    placeSupportArea(row);
  }

  placeMechanismArea(row);

  // Keep comment toggle styling/placement as before; compound sits right next to it (before it)
  placeCommentControlsArea(row);

  placeCommentArea(row);

  // Load comment if any
  if (data.comment) {
    commentBox.value = data.comment;
  }

  // Subfields logic
  typeSelect.addEventListener("change", () => {
    renderSubFields(typeSelect.value, subContainer, {});
  });

  const attrType = data.physicalAttribute || data.type;
  if (attrType) {
    typeSelect.value = attrType;
    iconPreview.src = ATTRIBUTE_ICONS[attrType] || "";

    if (attrType === "material") {
      renderSubFields(attrType, subContainer, {
        category: data.type,
        property: data.materialProperty
      });
    } else {
      renderSubFields(attrType, subContainer, {
        property: data.type
      });
    }
  }
}

function renderSubFields(type, container, values = {}) {
  container.innerHTML = "";

  if (type === "material") {
    const cat = document.createElement("select");
    cat.innerHTML = "<option value=''>Select Category</option>";
    ATTRIBUTE_SCHEMA.material.categories.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      cat.appendChild(o);
    });

    // const prop = document.createElement("select");
    // prop.innerHTML = "<option value=''>Select Property</option>";
    // ATTRIBUTE_SCHEMA.material.properties.forEach(opt => {
    //   const o = document.createElement("option");
    //   o.value = opt;
    //   o.textContent = opt;
    //   prop.appendChild(o);
    // });

    //if (values.category) cat.value = values.category;
    // if (values.property) prop.value = values.property;

    if (values && (values.type || values.category)) {
      cat.value = values.type || values.category;
    }

    // container.appendChild(cat);
    // container.appendChild(prop);

    const prop = document.createElement("select");
    // MULTI-SELECT for Material properties
    prop.classList.add("material-props-multi");

    // Build options (same as before, just no placeholder option for listbox)
    ATTRIBUTE_SCHEMA.material.properties.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      prop.appendChild(o);
    });

    // Behave like your metadata allowMultiple fields
    prop.multiple = true;
    prop.size = Math.min(ATTRIBUTE_SCHEMA.material.properties.length, 2);

    // Initialize from imported JSON (supports array or single string)
    const imported = values?.materialProperty ?? values?.property;
    if (Array.isArray(imported)) {
      const set = new Set(imported);
      Array.from(prop.options).forEach(o => { o.selected = set.has(o.value); });
    } else if (typeof imported === "string" && imported) {
      const match = Array.from(prop.options).find(o => o.value === imported);
      if (match) match.selected = true;
    }

    const row = document.createElement("div");
    row.className = "material-fields-row";
    row.appendChild(cat);
    row.appendChild(prop);
    container.appendChild(row);

  } else if (ATTRIBUTE_SCHEMA[type]) {
    const prop = document.createElement("select");
    prop.innerHTML = "<option value=''>Select Property</option>";
    ATTRIBUTE_SCHEMA[type].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      prop.appendChild(o);
    });

    if (values.property) prop.value = values.property;
    container.appendChild(prop);
  }
}

///////////////////////////////////////////////////////////// export JSON /////////////////////////////////////////////////////////

document.getElementById("exportJson").addEventListener("click", () => {
  // Collect Visual Elements
  const elements = Array.from(document.querySelectorAll(".element-wrapper")).map(wrapper => {
    const description = wrapper.querySelector("input")?.value || "";
    const elementType = wrapper.querySelector(".element-type")?.value || "";
    const elementDistData = wrapper.querySelector(".element-distdata")?.value || "";
    const elementDistReality = wrapper.querySelector(".element-distreality")?.value || "";
    const elementPerceptualRealism = wrapper.querySelector(".element-perceptualrealism")?.value || "";
    const elementHierarchy = wrapper.querySelector(".element-hierarchy")?.value || "";
    const comment = wrapper.querySelector("textarea")?.value || "";
    const title = document.getElementById("titleInput").value || "";
    const id = document.getElementById("idInput").value || "";

    const attrContainers = wrapper.querySelectorAll(".attribute-container");

    const extractAttributes = (container) => {
      const attrs = [];
      const rows = container.querySelectorAll(".attribute-row");

      rows.forEach(row => {
        const selects = row.querySelectorAll("select");

        // NEW: prefer a textarea inside the row; otherwise use the next sibling if it's a <textarea>
        const next = row.nextElementSibling;
        const textarea =
          row.querySelector("textarea") ||
          ((next && next.tagName === "TEXTAREA") ? next : null);

        const rawType  = selects[0]?.value || "";

        // const animated = (() => {
        //   const btn = row.querySelector(".anim-btn");
        //   if (btn) return btn.getAttribute("aria-pressed") === "true";
        //   if (row.dataset && "animated" in row.dataset) return row.dataset.animated === "true";
        //   return false;
        // })();

        function readToggle(row, selector) {
          const btn = row.querySelector(selector);
          return !!(btn && btn.getAttribute("aria-pressed") === "true");
        }

        const animated = readToggle(row, ".anim-btn");
        const semanticCongruence = row.querySelector(".semantic-congruence-dropdown")?.value || "";

        const base = {
          physicalAttribute: rawType,
          comment: textarea?.value?.trim?.() || "",
          animated,
        };

        // Compound id (Option 1)
        const attrItem = row.closest(".attr-item");
        const compoundRaw = attrItem?.dataset?.compoundId || "";
        base.compoundId = compoundRaw ? parseInt(compoundRaw, 10) : "";

        // Physical Mechanism -> read from the wrapper dataset
        const mechRoot = row.querySelector(".mechanism-root");
        if (mechRoot) {
          const cat = mechRoot.dataset.mechanismCategory || "none";
          base.mechanismCategory = cat;

          if (cat !== "none") {
            base.mechanismSubcategory = mechRoot.dataset.mechanismSubcat || "";
          } else {
            // optional: delete base.mechanismSubcategory if you previously set it
            // delete base.mechanismSubcategory;
          }
        }

        const dataVarSelect = row.querySelector(".data-variable-dropdown");
        if (dataVarSelect) {
          base.dataVariable = dataVarSelect.value;
        }

        // if (rawType === "material") {
        //   base.type = selects[1]?.value || "";
        //   base.materialProperty = selects[2]?.value || "";
        // } else {
        //   base.type = selects[1]?.value || "";
        // }

        if (rawType === "material") {
          base.type = selects[1]?.value || "";
          const propsSel = selects[2];
          if (propsSel && propsSel.multiple) {
            base.materialProperty = Array.from(propsSel.selectedOptions).map(o => o.value);
          } else {
            base.materialProperty = propsSel?.value || "";
          }
        } else {
          base.type = selects[1]?.value || "";
        }

        base.semanticCongruence = semanticCongruence || "";

        // const cs = row.querySelector(".contextual-support");
        // if (cs) {
        //   base.contextualSupport = cs.value || "";
        // }

        attrs.push(base);
      });

      return attrs;
    };

    const visualChannels = extractAttributes(attrContainers[0]);
    const contextualAttributes = extractAttributes(attrContainers[1]);

    const thumbnail = wrapper.querySelector("img")?.src || "";

    return { description, elementType, elementDistData, elementDistReality, elementPerceptualRealism, elementHierarchy, comment, visualChannels, contextualAttributes, thumbnail};
  });

  // Collect Metadata
  const metadata = {};
  Object.entries(METADATA_SCHEMA).forEach(([sectionId, fields]) => {
    metadata[sectionId] = {};

    fields.forEach(field => {
      const container = document.getElementById(field.id)?.parentElement;
      if (!container) return;

      const select = document.getElementById(field.id);
      const row = select?.closest("div");
      const textarea = row?.parentElement?.querySelector("textarea");
      const comment = textarea?.value || "";
      
      let value = "";
      if (field.allowMultiple) {
        const multiSelect = document.getElementById(field.id);
        value = Array.from(multiSelect?.selectedOptions || []).map(opt => opt.value);
      } else {
        const select = document.getElementById(field.id);
        value = select?.value || "";
      }

      if (field.label === "Method of Making" && value === "3D render") {
        const wrapper = document.getElementById(field.id)?.closest(".metadata-panel");
        const roleFields = wrapper.querySelectorAll(`[data-role]`);

        let techniques = "";
        let software = "";

        roleFields.forEach(select => {
          const role = select.getAttribute("data-role");
          if (role === "techniques") techniques = select.value;
          if (role === "software") software = select.value;
        });

        metadata[sectionId][field.label] = {
          value: "3D render",
          techniques,
          software,
          comment
        };
      }
      else if (field.label === "Method of Making" && value === "Graphic design - Illustration") {
        const wrapper = document.getElementById(field.id)?.closest(".metadata-panel");
        const technique = wrapper.querySelector('[data-role="technique"]')?.value || "";

        metadata[sectionId][field.label] = {
          value: "Graphic design - Illustration",
          technique,
          comment
        };
      }
      else {
        metadata[sectionId][field.label] = {
          value,
          comment
        };
      }
    });
  });

  // const coder = document.getElementById("coderSelect").value || "";
  const title = document.getElementById("titleInput").value || "";
  const id = document.getElementById("idInput").value || "";
  const presentation = document.getElementById("presentationSelect").value || "";
  const description = document.getElementById("descriptionInput").value || "";
  const link = document.getElementById("linkInput").value || "";

  // Export data variables
  const dataVariableTags = Array.from(document.querySelectorAll(".data-variable-tag")).map(tag => tag.textContent);
  
  const imageData = window._imageDataUrl || "";
  const json = {
    title,
    id,
    // coder,
    presentation,
    description,
    link,
    dataVariables: dataVariableTags,
    metadata,
    visualElements: elements,
    image: imageData
  };

  const id_title = document.getElementById("idInput").value.trim().replace(/\s+/g, "_");
  const title_title = document.getElementById("titleInput").value.trim().replace(/\s+/g, "_");

  const fileName = `${id_title || "noID"}_${title_title || "noTitle"}_${coder || "noCoder"}_${presentation || "noPresentation"}.json`;

  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
});

///////////////////////////////////////////////////////////// create metadata ////////////////////////////////////////////////////

function createMetadataSection(sectionId, title, fields) {
  const outer = document.getElementById(sectionId);
  outer.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "metadata-panel";

  const heading = document.createElement("h3");
  heading.textContent = title;
  panel.appendChild(heading);

  fields.forEach(field => {
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = field.label;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "10px";
    row.style.marginBottom = "8px";

    const nestedContainer = document.createElement("div");
    nestedContainer.style.marginLeft = "15px";
    nestedContainer.style.marginTop = "5px";

    const comment = document.createElement("textarea");
    comment.placeholder = "Comment...";
    const toggleComment = createCommentToggle(comment);

    if (field.allowMultiple) {
      const select = document.createElement("select");
      select.id = field.id;
      select.multiple = true;
      select.size = Math.min(field.options.length, 5); 

      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      row.appendChild(select);
    } else {
      const select = document.createElement("select");
      select.id = field.id;
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = "Please select...";
      select.appendChild(placeholder);

      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });

      row.appendChild(select);

      // Nested field rendering for special cases
      select.addEventListener("change", () => {
        nestedContainer.innerHTML = "";
        const selected = select.value;
        const nested = field.nested?.[selected];
        if (!nested) return;

        if (nested.techniques || nested.software) {
          const techSelect = document.createElement("select");
          techSelect.setAttribute("data-role", "techniques");
          techSelect.innerHTML = `<option value=''>Select Technique...</option>`;
          nested.techniques.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            techSelect.appendChild(opt);
          });

          const softSelect = document.createElement("select");
          softSelect.setAttribute("data-role", "software");
          softSelect.innerHTML = `<option value=''>Select Software...</option>`;
          nested.software.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = s;
            softSelect.appendChild(opt);
          });

          nestedContainer.appendChild(techSelect);
          nestedContainer.appendChild(softSelect);
        } else if (nested.technique) {
          const techniqueSelect = document.createElement("select");
          techniqueSelect.setAttribute("data-role", "technique");
          techniqueSelect.innerHTML = `<option value=''>Select Technique...</option>`;
          nested.technique.forEach(val => {
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = val;
            techniqueSelect.appendChild(opt);
          });
          nestedContainer.appendChild(techniqueSelect);
        }
      });
    }

    row.appendChild(toggleComment);
    wrapper.appendChild(label);
    wrapper.appendChild(row);
    wrapper.appendChild(nestedContainer);
    wrapper.appendChild(comment);
    panel.appendChild(wrapper);
  });

  outer.appendChild(panel);
}

document.addEventListener("DOMContentLoaded", () => {
  Object.entries(METADATA_SCHEMA).forEach(([sectionId, fields]) => {
    const title = {
      metadataVisInfo: "Visualization Information",
      // metadataRealism: "Realism & Metaphors",
      metadataSubjective: "Subjective Effects"
    }[sectionId];

    createMetadataSection(sectionId, title, fields);
  });
  resetInfoAndMetadata();
});


////////////////////////////////////////////////////////////// Image input ///////////////////////////////////////////////////////


document.getElementById("imageInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;

    // Show image
    const img = document.getElementById("uploadedImage");
    img.src = base64;
    img.style.display = "block";

    window._imageDataUrl = base64;
  };
  reader.readAsDataURL(file);
});

////////////////////////////////////////////////////////////// Data Variables ///////////////////////////////////////////////////////

function createDataVariableTag(varName) {
  const tag = document.createElement("span");
  tag.className = "data-variable-tag";
  tag.textContent = varName;
  tag.title = "Click to remove";
  tag.addEventListener("click", () => {
    tag.remove();
    refreshAllDataVariableDropdowns(); // 🔁 update dropdowns
  });
  return tag;
}

function refreshAllDataVariableDropdowns() {
  const globalTags = Array.from(document.querySelectorAll(".data-variable-tag")).map(t => t.textContent);

  document.querySelectorAll(".data-variable-dropdown").forEach(dropdown => {
    const currentValue = dropdown.value;
    dropdown.innerHTML = "<option value=''>Select Data Variable</option>";
    globalTags.forEach(tag => {
      const opt = document.createElement("option");
      opt.value = tag;
      opt.textContent = tag;
      dropdown.appendChild(opt);
    });
    dropdown.value = currentValue; // restore selection if still valid
  });
}

////////////////////////////////////////////////////////////// Helpers ///////////////////////////////////////////////////////

// Reusable icon toggle (returns the <button>)
function createIconToggle({
  iconSrc,
  alt = "toggle",
  initial = false,
  titleOn = "On",
  titleOff = "Off",
  className = "icon-toggle",
  // If you want the state mirrored on some element's dataset + class:
  stateTarget = null,          // e.g., the row element
  datasetKey = null,           // e.g., "animated"
  pressedClass = null,         // e.g., "is-animated"
  onChange = null              // (val:boolean) => void
} = {}) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.setAttribute("aria-pressed", initial ? "true" : "false");
  btn.title = initial ? titleOn : titleOff;

  const img = document.createElement("img");
  img.src = iconSrc;
  img.alt = alt;
  img.width = 16;
  img.height = 16;
  btn.appendChild(img);

  // reflect initial on target
  if (stateTarget && datasetKey) {
    stateTarget.dataset[datasetKey] = initial ? "true" : "false";
    if (pressedClass) stateTarget.classList.toggle(pressedClass, initial);
  }

  btn.addEventListener("click", () => {
    const next = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", next ? "true" : "false");
    btn.title = next ? titleOn : titleOff;

    if (stateTarget && datasetKey) {
      stateTarget.dataset[datasetKey] = next ? "true" : "false";
      if (pressedClass) stateTarget.classList.toggle(pressedClass, next);
    }

    if (typeof onChange === "function") onChange(next);
  });

  return btn;
}

/**
 * Create a Physical Mechanism control.
 * Returns { root, getValue, setValue }
 */
function createMechanismControl({
  initialCategory = null,              // "biological" | "physics" | "artificial" | null
  initialSubcat = "",
  onChange = null                      // ({category, subcategory}) => void
} = {}) {
  // Root wrapper that also carries state for export
  const root = document.createElement("div");
  root.className = "mech-pop mechanism-root";
  root.dataset.open = "false";
  root.dataset.mechanismCategory = initialCategory ? initialCategory : "none";
  root.dataset.mechanismSubcat   = initialSubcat || "";

  // Trigger button (reuses your .icon-toggle style)
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "icon-toggle mech-trigger";
  trigger.setAttribute("aria-pressed", initialCategory ? "true" : "false");
  trigger.title = initialCategory ? `Physical mechanism: ${initialCategory}` : "Physical mechanism (None)";

  const trigImg = document.createElement("img");
  trigImg.alt = "Mechanism";
  trigImg.src = initialCategory ? (MECH_ICONS[initialCategory] || MECH_ICONS.mechanism) : MECH_ICONS.mechanism;
  trigger.appendChild(trigImg);

  // Inline menu (3 options)
  const menu = document.createElement("div");
  menu.className = "mech-menu";

  const OPTIONS = ["biological","physics"];
  OPTIONS.forEach(key => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mech-btn";
    b.dataset.key = key;
    b.setAttribute("aria-pressed", initialCategory === key ? "true" : "false");
    b.title = key[0].toUpperCase() + key.slice(1);
    const img = document.createElement("img");
    img.src = MECH_ICONS[key]; img.alt = key;
    b.appendChild(img);
    b.addEventListener("click", () => {
      setValue(key, root.dataset.mechanismSubcat);
      setOpen(false);
    });
    menu.appendChild(b);
  });

  // Subcategory select (hidden when default)
  const sub = document.createElement("select");
  sub.classList.add("attribute-type-select"); 
  sub.hidden = !initialCategory;

  function populateSub(cat, preferred = "") {
    sub.innerHTML = "";

    // Placeholder shown on first open
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Please select…";
    ph.disabled = true;                // not selectable after a choice
    ph.selected = !preferred;          // selected only when no previous value
    sub.appendChild(ph);

    const list = MECH_SUBCATS[cat] || [];
    list.forEach(v => {
      const o = document.createElement("option");
      o.value = o.textContent = v;
      sub.appendChild(o);
    });
    sub.value = preferred && list.includes(preferred) ? preferred : "";
  }
  if (initialCategory) populateSub(initialCategory, initialSubcat);

  sub.addEventListener("change", () => {
    root.dataset.mechanismSubcat = sub.value || "";
    if (typeof onChange === "function") onChange(getValue());
  });

  // Open/close behavior
  function setOpen(open) { root.dataset.open = open ? "true" : "false"; }
  function isOpen() { return root.dataset.open === "true"; }

  // Click trigger:
  //  - if default -> open menu
  //  - if selected -> reset to default (no menu)
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const cat = root.dataset.mechanismCategory;
    if (!cat || cat === "none") {
      setOpen(true);
    } else {
      setValue(null, "");
      setOpen(false);
    }
  });

  // Click outside closes
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) setOpen(false);
  });

  // State setters/getters
  function setValue(category, subcat = "") {
    const normalized = category || "none";
    root.dataset.mechanismCategory = normalized;
    root.dataset.mechanismSubcat   = (normalized === "none") ? "" : (subcat || "");

    // trigger visuals
    trigger.setAttribute("aria-pressed", normalized !== "none" ? "true" : "false");
    trigger.title = normalized !== "none" ? `Physical mechanism: ${normalized}` : "Physical mechanism (None)";
    trigImg.src = normalized !== "none" ? (MECH_ICONS[normalized] || MECH_ICONS.mechanism) : MECH_ICONS.mechanism;

    // menu pressed states
    Array.from(menu.children).forEach(btn => {
      btn.setAttribute("aria-pressed", btn.dataset.key === (normalized !== "none" ? normalized : "") ? "true" : "false");
    });

    // subcat visibility
    if (normalized === "none") {
      sub.hidden = true;
      sub.innerHTML = "";
    } else {
      sub.hidden = false;
      populateSub(normalized, root.dataset.mechanismSubcat);
    }

    if (typeof onChange === "function") onChange(getValue());
  }

  function getValue() {
    const category = root.dataset.mechanismCategory || "none";
    return {
      category,                                      // "none" | "biological" | "physics" | "artificial"
      subcategory: category === "none" ? "" : (root.dataset.mechanismSubcat || "")
    };
  }

  // Assemble DOM
  root.appendChild(sub);
  root.appendChild(trigger);
  root.appendChild(menu);

  return { root, getValue, setValue };
}

/* ===============================
   Row mini-panels — per-area API
   =============================== */

// ---------- helpers (no :scope) ----------
function _directChild(row, className) {
  for (const el of row.children) {
    if (el.classList && el.classList.contains(className)) return el;
  }
  return null;
}
function _ensurePanel(row, className, afterEl /* may be null */) {
  let panel = _directChild(row, className);
  if (!panel) {
    panel = document.createElement('div');
    panel.className = `row-area ${className}`;
    if (afterEl && afterEl.parentNode === row) {
      row.insertBefore(panel, afterEl.nextSibling);
    } else {
      // attr-area should be first; others can go to the end by default
      if (className === 'attr-area') row.insertBefore(panel, row.firstChild);
      else row.appendChild(panel);
    }
  }
  return panel;
}
function _moveFirst(row, selector, into) {
  const el = row.querySelector(selector);
  if (el && into && el.parentNode !== into) into.appendChild(el);
  return !!el;
}
function _moveAll(row, selector, into) {
  row.querySelectorAll(selector).forEach(el => {
    if (el.parentNode !== into) into.appendChild(el);
  });
}

// ---------- AREA 1: Attribute ----------
function placeAttrArea(row) {
  if (!row || !row.classList || !row.classList.contains('attribute-row')) return;

  // 1) ensure the Attribute panel exists and is first
  const attr = _ensurePanel(row, 'attr-area', null);

  // 2) move the expected pieces in correct order
  _moveFirst(row, '.attribute-icon', attr);
  _moveFirst(row, '.attribute-type-select', attr);

  // Only TRUE attribute subcategories (exclude mechanism subcat)
  row.querySelectorAll('.attribute-subcategory-select').forEach(sel => {
    if (!sel.classList.contains('mech-subcat')) attr.appendChild(sel);
  });

  // Animated toggle
  _moveFirst(row, '.anim-btn', attr);
}

// ---------- AREA 2: Support (Data rows only) ----------
function placeSupportArea(row) {
  if (!row || !row.classList || !row.classList.contains('attribute-row')) return;

  // If a row has neither data-variable nor support, remove panel (contextual rows)
  const hasBits = !!(row.querySelector('.data-variable-dropdown') || row.querySelector('.semantic-congruence-dropdown'));
  const attr = _directChild(row, 'attr-area') || _ensurePanel(row, 'attr-area', null);

  let support = _directChild(row, 'support-area');
  if (!hasBits) { if (support) support.remove(); return; }

  // Ensure Support panel exists RIGHT AFTER Attribute
  support = support || (function(){
    const p = document.createElement('div');
    p.className = 'row-area support-area';
    if (attr.nextSibling) row.insertBefore(p, attr.nextSibling);
    else row.appendChild(p);
    return p;
  })();

  // Order: [data-variable] [semantic-congruence]
_moveFirst(row, '.data-variable-dropdown', support);
_moveFirst(row, '.semantic-congruence-dropdown', support);

const dv  = support.querySelector('.data-variable-dropdown');
const sem = support.querySelector('.semantic-congruence-dropdown');
if (dv && sem && sem.previousElementSibling !== dv) {
  support.insertBefore(sem, dv.nextSibling);
}

// If nothing ended up inside (edge case), remove the panel

  if (!support.firstElementChild) support.remove();
}

// ---------- AREA 3: Mechanism ----------
function placeMechanismArea(row) {
  if (!row || !row.classList || !row.classList.contains('attribute-row')) return;

  const attr    = _directChild(row, 'attr-area')    || _ensurePanel(row, 'attr-area', null);
  const support = _directChild(row, 'support-area'); // may be null if contextual

  // Mechanism panel should be AFTER Support (if present) otherwise after Attribute
  const after = support || attr;
  const mech  = _ensurePanel(row, 'mech-area', after);

  // Mechanism root (gear button) belongs here
  const mechRoot = row.querySelector('.mechanism-root');
  if (mechRoot && mechRoot.parentNode !== mech) mech.appendChild(mechRoot);

  // Ensure mechanism subcategory is NOT flagged as attribute subcategory
  row.querySelectorAll('.mech-subcat.attribute-subcategory-select')
    .forEach(sc => sc.classList.remove('attribute-subcategory-select'));

  // Keep any .mech-subcat with the mechanism (preferably under mechRoot)
  row.querySelectorAll('.mech-subcat').forEach(sc => {
    if (mechRoot && !mechRoot.contains(sc)) mechRoot.appendChild(sc);
    else if (!mechRoot && sc.parentNode !== mech) mech.appendChild(sc);
  });
}


// ---------- AREA 4: Comment controls (Compound + Comment toggle) ----------
// Keep the comment toggle exactly as before (no wrapper/panel), and place the compound dropdown
// right next to it (immediately before it). Both should live as *direct children* of the row,
// not inside the mechanism panel or a dedicated container.
function placeCommentControlsArea(row) {
  if (!row || !row.classList || !row.classList.contains('attribute-row')) return;

  const compound = row.querySelector('.compound-select');
  const toggle = row.querySelector('.comment-toggle');

  if (!compound || !toggle) return;

  // Leave the comment toggle EXACTLY where it already is.
  // Only ensure the compound dropdown sits immediately before it (as a sibling),
  // and do not wrap them into any panel/container.

  // Ensure compound is a direct child of the row (not inside mech/support panels)
  if (compound.parentNode !== row) {
    row.insertBefore(compound, toggle.parentNode === row ? toggle : null);
  }

  // Move compound right before the toggle
  if (toggle.parentNode === row && compound.parentNode === row && toggle.previousElementSibling !== compound) {
    row.insertBefore(compound, toggle);
  }
}


// -------- AREA 5: Comment (textarea) --------
function placeCommentArea(row){
  if (!row || !row.classList || !row.classList.contains('attribute-row')) return;

  // If the comment is already inside the row, we're done
  if (row.querySelector('textarea, .comment-box, .attribute-comment')) return;

  // Otherwise, if the *next sibling* is the comment, move it inside the row
  const sib = row.nextElementSibling;
  if (sib && sib.matches('textarea, .comment-box, .attribute-comment')) {
    row.appendChild(sib); // move the exact node, preserve all styles/behaviour
  }
}


// --------------------------------------------------------- Example Dropdown ---------------------------------------------------------

async function fetchAndLoadExample(filePath) {
  const res = await fetch(filePath);
  if (!res.ok) throw new Error(`Could not load ${filePath}`);
  const data = await res.json();
  loadExampleData(data);
}

document.addEventListener("DOMContentLoaded", () => {
  const dropBtn  = document.getElementById("exampleDropdownBtn");
  const dropList = document.getElementById("exampleDropdownList");
  if (!dropBtn || !dropList) return;

  // Toggle open/close — registered immediately, no async dependency
  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropList.classList.toggle("open");
  });

  // Close when clicking outside
  document.addEventListener("click", () => dropList.classList.remove("open"));

  // Populate list from manifest
  fetch("examples/manifest.json")
    .then(res => res.json())
    .then(manifest => {
      manifest.forEach(entry => {
        const btn = document.createElement("button");
        btn.textContent = `${entry.id} — ${entry.title}`;
        btn.addEventListener("click", () => {
          dropList.classList.remove("open");
          fetchAndLoadExample(entry.file).catch(err => alert("Failed to load example: " + err.message));
        });
        dropList.appendChild(btn);
      });
    })
    .catch(() => {
      const msg = document.createElement("p");
      msg.style.cssText = "padding:10px 14px; color:#aaa; font-size:12px; margin:0;";
      msg.textContent = "Examples unavailable — use a local server or deploy to GitHub Pages.";
      dropList.appendChild(msg);
    });

  // Auto-load from ?example=ID URL param
  const params = new URLSearchParams(window.location.search);
  const exampleId = params.get("example");
  if (exampleId) {
    fetch("examples/manifest.json")
      .then(res => res.json())
      .then(manifest => {
        const entry = manifest.find(e => String(e.id) === String(exampleId));
        if (entry) return fetchAndLoadExample(entry.file);
      })
      .catch(e => console.warn("Could not auto-load example from URL param", e));
  }
});

