'use strict';

module.exports = function missing_ref_plugin(md, cb) {
    /**
     * 
     * This was hacked rapidly out of link.js in markdown-it 
     */
    function findMissingRef(state) {
        var 
        label,
        labelEnd,
        labelStart,
        pos,
        ref,
        oldPos = state.pos,
        max = state.posMax,
        start = state.pos;
  
        if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }
    
        labelStart = state.pos + 1;
        labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
    
        // parser failed to find ']', so it's not a valid link
        if (labelEnd < 0) { return false; }
        
        //
        // Link reference
        //
        if (typeof state.env.references === 'undefined') { 
            if (! state.env.missingReferences) state.env.missingReferences = [];
            state.env.missingReferences.push(state.src.slice(labelStart, labelEnd));
            return false;
        }
    
        if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) {
            label = state.src.slice(start, pos++);
            } else {
            pos = labelEnd + 1;
            }
        } else {
            pos = labelEnd + 1;
        }
    
        // covers label === '' and label === undefined
        // (collapsed reference link and shortcut reference link respectively)
        if (!label) { label = state.src.slice(labelStart, labelEnd); }
    
        ref = state.env.references[label];
        if (!ref) {
            state.pos = oldPos;
    
            if (! state.env.missingReferences) state.env.missingReferences = [];
            state.env.missingReferences.push(state.src.slice(labelStart, labelEnd));
            return false;
        }
    }

    function cbMissingRef(state,) {
        if (state.env.missingReferences) {
            cb(state.env.missingReferences);
        }
    }
    
    md.inline.ruler.after('link', 'find_missing_ref', findMissingRef, {});
    md.core.ruler.after('replacements', 'cb_missing_ref', cbMissingRef, {});
}