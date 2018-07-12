import { __extends, __values, __spread } from 'tslib';
import { assert, crc32, hashCode, isArray, isBlank, isPresent, print, shiftLeft, StringJoiner, unimplemented, BooleanWrapper, evalExpressionWithCntx, FieldPath, isBoolean, isFunction, isNumber, isString, className, Extensible, isStringMap, ListWrapper, MapWrapper, objectToName, equals, isEntity, isValue, shiftRight, StringWrapper, AppConfig, decamelize, Environment, RoutingService, warn, nonPrivatePrefix, AribaCoreModule } from '@aribaui/core';
import { Dictionary, util } from 'typescript-collections';
import { ComponentRegistry, BaseFormComponent, DomUtilsService, IncludeComponentDirective, FormRowComponent, BaseComponent, SectionComponent, AribaComponentsModule } from '@aribaui/components';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, SkipSelf, NgModule, Injectable, ChangeDetectorRef, ComponentFactoryResolver, Directive, ViewContainerRef, Host, ViewChild, ViewChildren, APP_INITIALIZER, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Represents a set of matching rules resulting from looking up a set of key/values
 *  against the Meta rule base.
 *
 * Instances of the Match superclass are simply immutable snapshots of previous matches
 * (used as keys in Match -> Properties lookup caches).
 * The more meaty class is its static inner subclass, Match.MatchResult.
 */
var Match = /** @class */ (function () {
    function Match(_matches, _keysMatchedMask, _matchPathCRC) {
        if (_matchPathCRC === void 0) { _matchPathCRC = 0; }
        this._matches = _matches;
        this._keysMatchedMask = _keysMatchedMask;
        this._matchPathCRC = _matchPathCRC;
    }
    // Word lists are int arrays with the first element holding the length
    /**
     * @param {?} intArr
     * @param {?} val
     * @return {?}
     */
    Match.addInt = /**
     * @param {?} intArr
     * @param {?} val
     * @return {?}
     */
    function (intArr, val) {
        if (isBlank(intArr)) {
            var /** @type {?} */ r = new Array(4);
            r[0] = 1;
            r[1] = val;
            return r;
        }
        var /** @type {?} */ newPos = intArr[0];
        if (intArr[newPos++] === val) {
            return intArr;
        } // already here...
        if (newPos >= intArr.length) {
            var /** @type {?} */ a = new Array(newPos * 2);
            a = intArr.slice(0, newPos);
            intArr = a;
        }
        intArr[newPos] = val;
        intArr[0] = newPos;
        return intArr;
    };
    // only rules that use only the activated (queried) keys
    /**
     * @param {?} rules
     * @param {?} arr
     * @param {?} usesMask
     * @return {?}
     */
    Match.filterMustUse = /**
     * @param {?} rules
     * @param {?} arr
     * @param {?} usesMask
     * @return {?}
     */
    function (rules, arr, usesMask) {
        if (isBlank(arr)) {
            return null;
        }
        var /** @type {?} */ result;
        var /** @type {?} */ count = arr[0];
        for (var /** @type {?} */ i = 0; i < count; i++) {
            var /** @type {?} */ r = arr[i + 1];
            var /** @type {?} */ rule = rules[r];
            if ((rule.keyMatchesMask & usesMask) !== 0) {
                result = Match.addInt(result, r);
            }
        }
        return result;
    };
    /**
     * Intersects two rulevecs.  This is not a traditional intersection where only items in both
     * inputs are included in the result: we only intersect rules that match on common keys;
     * others are unioned.
     *
     * For instance, say we have the following inputs:
     *      a:  [matched on: class, layout]  (class=Foo, layout=Inspect)
     *          1) class=Foo layout=Inspect { ... }
     *          2) class=Foo operation=edit { ... }
     *          3) layout=Inspect operation=view { ... }
     *
     *      b:  [matched on: operation]  (operation=view)
     *          3) layout=Inspect operation=view { ... }
     *          4) operation=view type=String { ... }
     *          5) operation=view layout=Tabs { ... }
     *
     * The result should be: 1, 3, 4
     * I.e.: items that appear in both (#3 above) are included, as are items that appear in just
     * one,
     * *but don't match on the keys in the other* (#1 and #4 above).
     *
     * @param allRules the full rule base
     * @param a first vector of rule indexes
     * @param b second vector of rule indexes
     * @param aMask mask indicating the keys against which the first rule vectors items have
     *     already been matched
     * @param bMask mask indicating the keys against which the second rule vectors items have
     *     already been matched
     * @return rule vector for the matches
     */
    /**
     * Intersects two rulevecs.  This is not a traditional intersection where only items in both
     * inputs are included in the result: we only intersect rules that match on common keys;
     * others are unioned.
     *
     * For instance, say we have the following inputs:
     *      a:  [matched on: class, layout]  (class=Foo, layout=Inspect)
     *          1) class=Foo layout=Inspect { ... }
     *          2) class=Foo operation=edit { ... }
     *          3) layout=Inspect operation=view { ... }
     *
     *      b:  [matched on: operation]  (operation=view)
     *          3) layout=Inspect operation=view { ... }
     *          4) operation=view type=String { ... }
     *          5) operation=view layout=Tabs { ... }
     *
     * The result should be: 1, 3, 4
     * I.e.: items that appear in both (#3 above) are included, as are items that appear in just
     * one,
     * *but don't match on the keys in the other* (#1 and #4 above).
     *
     * @param {?} allRules the full rule base
     * @param {?} a first vector of rule indexes
     * @param {?} b second vector of rule indexes
     * @param {?} aMask mask indicating the keys against which the first rule vectors items have
     *     already been matched
     * @param {?} bMask mask indicating the keys against which the second rule vectors items have
     *     already been matched
     * @return {?} rule vector for the matches
     */
    Match.intersect = /**
     * Intersects two rulevecs.  This is not a traditional intersection where only items in both
     * inputs are included in the result: we only intersect rules that match on common keys;
     * others are unioned.
     *
     * For instance, say we have the following inputs:
     *      a:  [matched on: class, layout]  (class=Foo, layout=Inspect)
     *          1) class=Foo layout=Inspect { ... }
     *          2) class=Foo operation=edit { ... }
     *          3) layout=Inspect operation=view { ... }
     *
     *      b:  [matched on: operation]  (operation=view)
     *          3) layout=Inspect operation=view { ... }
     *          4) operation=view type=String { ... }
     *          5) operation=view layout=Tabs { ... }
     *
     * The result should be: 1, 3, 4
     * I.e.: items that appear in both (#3 above) are included, as are items that appear in just
     * one,
     * *but don't match on the keys in the other* (#1 and #4 above).
     *
     * @param {?} allRules the full rule base
     * @param {?} a first vector of rule indexes
     * @param {?} b second vector of rule indexes
     * @param {?} aMask mask indicating the keys against which the first rule vectors items have
     *     already been matched
     * @param {?} bMask mask indicating the keys against which the second rule vectors items have
     *     already been matched
     * @return {?} rule vector for the matches
     */
    function (allRules, a, b, aMask, bMask) {
        if (isBlank(a)) {
            return b;
        }
        var /** @type {?} */ result;
        var /** @type {?} */ iA = 1, /** @type {?} */ sizeA = isPresent(a[0]) ? a[0] : 0, /** @type {?} */ iB = 1, /** @type {?} */ sizeB = isPresent(b[0]) ? b[0] : 0;
        Match._Debug_ElementProcessCount += sizeA + sizeB;
        while (iA <= sizeA || iB <= sizeB) {
            var /** @type {?} */ iAMask = (iA <= sizeA) ? allRules[a[iA]].keyIndexedMask : 0;
            var /** @type {?} */ iBMask = (iB <= sizeB) ? allRules[b[iB]].keyIndexedMask : 0;
            var /** @type {?} */ c = (iA > sizeA ? 1 : (iB > sizeB ? -1 : (a[iA] - b[iB])));
            if (c === 0) {
                result = Match.addInt(result, a[iA]);
                iA++;
                iB++;
            }
            else if (c < 0) {
                // If A not in B, but A doesn't filter on B's mask, then add it
                if ((iAMask & bMask) === 0) {
                    result = Match.addInt(result, a[iA]);
                }
                iA++;
            }
            else {
                if ((iBMask & aMask) === 0) {
                    result = Match.addInt(result, b[iB]);
                }
                iB++;
            }
        }
        return result;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    Match.union = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        if (isBlank(a)) {
            return b;
        }
        if (isBlank(b)) {
            return a;
        }
        var /** @type {?} */ sizeA = a[0], /** @type {?} */ sizeB = b[0];
        if (sizeA === 0) {
            return b;
        }
        if (sizeB === 0) {
            return a;
        }
        Match._Debug_ElementProcessCount += (sizeA + sizeB);
        var /** @type {?} */ result;
        var /** @type {?} */ iA = 1, /** @type {?} */ vA = a[1], /** @type {?} */ iB = 1, /** @type {?} */ vB = b[1];
        while (iA <= sizeA || iB <= sizeB) {
            var /** @type {?} */ c = vA - vB;
            result = Match.addInt(result, ((c <= 0) ? vA : vB));
            if (c <= 0) {
                iA++;
                vA = (iA <= sizeA) ? a[iA] : Number.MAX_VALUE;
            }
            if (c >= 0) {
                iB++;
                vB = (iB <= sizeB) ? b[iB] : Number.MAX_VALUE;
            }
        }
        return result;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    Match._arrayEq = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        if (a === b) {
            return true;
        }
        if (a === null || b === null) {
            return false;
        }
        var /** @type {?} */ count = a[0];
        if (count !== b[0]) {
            return false;
        }
        for (var /** @type {?} */ i = 1; i <= count; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Filter a partially matched set of rules down to the actual matches.
     * The input set of rules, matchesArr, is based on a *partial* match, and so includes rules
     * that were touched by some of the queried keys, but that may also require *additional* keys
     * that we have not matched on -- these must now be removed. Also, when 'partial indexing',
     * rules are indexed on a subset of their keys, so matchesArr will contain rules that need to
     * be evaluated against those MatchValues upon which they were not indexed (and therefore not
     * intersected / filtered on in the lookup process).
     */
    /**
     * Filter a partially matched set of rules down to the actual matches.
     * The input set of rules, matchesArr, is based on a *partial* match, and so includes rules
     * that were touched by some of the queried keys, but that may also require *additional* keys
     * that we have not matched on -- these must now be removed. Also, when 'partial indexing',
     * rules are indexed on a subset of their keys, so matchesArr will contain rules that need to
     * be evaluated against those MatchValues upon which they were not indexed (and therefore not
     * intersected / filtered on in the lookup process).
     * @param {?} allRules
     * @param {?} maxRule
     * @param {?} matchesArr
     * @param {?} queriedMask
     * @param {?} matchArray
     * @return {?}
     */
    Match.prototype.filter = /**
     * Filter a partially matched set of rules down to the actual matches.
     * The input set of rules, matchesArr, is based on a *partial* match, and so includes rules
     * that were touched by some of the queried keys, but that may also require *additional* keys
     * that we have not matched on -- these must now be removed. Also, when 'partial indexing',
     * rules are indexed on a subset of their keys, so matchesArr will contain rules that need to
     * be evaluated against those MatchValues upon which they were not indexed (and therefore not
     * intersected / filtered on in the lookup process).
     * @param {?} allRules
     * @param {?} maxRule
     * @param {?} matchesArr
     * @param {?} queriedMask
     * @param {?} matchArray
     * @return {?}
     */
    function (allRules, maxRule, matchesArr, queriedMask, matchArray) {
        if (isBlank(matchesArr)) {
            return null;
        }
        // print('\n## Filtering matching: ' + matchesArr[0] + ', Queried Mask: ' + queriedMask);
        //
        // for (let i = 1; i <= matchesArr[0]; i++) {
        //     print('## ' + matchesArr[i] + '): ' + allRules[matchesArr[i]].toString());
        // }
        var /** @type {?} */ result;
        var /** @type {?} */ count = matchesArr[0];
        for (var /** @type {?} */ i = 0; i < count; i++) {
            var /** @type {?} */ r = matchesArr[i + 1];
            if (r >= maxRule) {
                continue;
            }
            var /** @type {?} */ rule = allRules[r];
            if (rule.disabled() || (rule.keyAntiMask & queriedMask) !== 0) {
                continue;
            }
            // Must have matched on (activate) all match keys for this rule, *and*
            // if have any non-indexed rules, need to check match on those
            if (((rule.keyMatchesMask & ~queriedMask) === 0) &&
                ((rule.keyMatchesMask === rule.keyIndexedMask)
                    ||
                        (isPresent(matchArray) && rule.matches(matchArray)))) {
                if (Meta._DebugDoubleCheckMatches && !(matchArray != null && rule.matches(matchArray))) {
                    assert(false, 'Inconsistent (negative) match on rule: ' + rule);
                }
                result = Match.addInt(result, r);
            }
            else if (Meta._DebugDoubleCheckMatches && (matchArray != null && rule.matches(matchArray))) ;
        }
        // if (isPresent(result) && result.length > 0) {
        //     print('\n\n\n #### Filtering RESULT: ' + result[0]);
        //
        //     for (let i = 1; i <= result[0]; i++) {
        //         print('## ' + result[i] + '): ' + allRules[result[i]].toString());
        //     }
        // }
        return result;
    };
    /**
     * @return {?}
     */
    Match.prototype.hashCode = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ ret = this._keysMatchedMask * 31 + this._matchPathCRC;
        if (isPresent(this._matches)) {
            for (var /** @type {?} */ i = 0, /** @type {?} */ c = this._matches[0]; i < c; i++) {
                ret = crc32(ret, this._matches[i + 1]);
            }
        }
        return ret;
    };
    Object.defineProperty(Match.prototype, "keysMatchedMask", {
        get: /**
         * @return {?}
         */
        function () {
            return this._keysMatchedMask;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} o
     * @return {?}
     */
    Match.prototype.equalsTo = /**
     * @param {?} o
     * @return {?}
     */
    function (o) {
        return ((o instanceof Match) && this._keysMatchedMask === o._keysMatchedMask) &&
            this._matchPathCRC === o._matchPathCRC &&
            Match._arrayEq(this._matches, o._matches);
    };
    /**
     * @return {?}
     */
    Match.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ buf = new StringJoiner([]);
        buf.add('_matches');
        buf.add((isPresent(this._matches) ? this._matches.length : 0) + '');
        buf.add('_keysMatchedMask');
        buf.add(this._keysMatchedMask + '');
        buf.add('_keysMatchedMask');
        buf.add(this._matchPathCRC + '');
        buf.add('hashcode');
        buf.add(this.hashCode() + '');
        return buf.toString();
    };
    Match.EmptyMatchArray = [];
    Match._Debug_ElementProcessCount = 0;
    return Match;
}());
/**
 *  An Match which includes a UnionMatchResult part (which is used by Context to
 * represent the set of overridden key/values up the stack)
 */
var  /**
 *  An Match which includes a UnionMatchResult part (which is used by Context to
 * represent the set of overridden key/values up the stack)
 */
MatchWithUnion = /** @class */ (function (_super) {
    __extends(MatchWithUnion, _super);
    function MatchWithUnion(_matches, _keysMatchedMask, _matchPathCRC, _overUnionMatch) {
        if (_matchPathCRC === void 0) { _matchPathCRC = 0; }
        var _this = _super.call(this, _matches, _keysMatchedMask, _matchPathCRC) || this;
        _this._matches = _matches;
        _this._keysMatchedMask = _keysMatchedMask;
        _this._matchPathCRC = _matchPathCRC;
        _this._overUnionMatch = _overUnionMatch;
        return _this;
    }
    /**
     * @param {?} o
     * @return {?}
     */
    MatchWithUnion.prototype.equalsTo = /**
     * @param {?} o
     * @return {?}
     */
    function (o) {
        return _super.prototype.equalsTo.call(this, o) && ((this._overUnionMatch === o._overUnionMatch) ||
            ((isPresent(this._overUnionMatch)) && isPresent(o._overUnionMatch) && this._overUnionMatch.equalsTo(o._overUnionMatch)));
    };
    return MatchWithUnion;
}(Match));
/**
 *  MatchResult represents the result of computing the set of matching rules
 *  based on the key/value on this instance, and the other key/value pairs
 * on its predecessor chain.  I.e. to find the matching rules for the context keys
 * {operation=edit; layout=Inspect; class=Foo}, first a MatchResult is created for
 * 'operation=edit' and passed as the 'prev' to the creation of another for 'layout=Inspect',
 * and so on.  In this way the MatchResults form a *(sharable) partial-match tree.*
 *
 * The ability to result previous partial match 'paths' is an important optimization:
 * the primary client of MatchResult (and of rule matching in general) is the Context, when each
 * assignment pushes a record on a stack that (roughly) extends the Match from the previous
 * assignment.  By caching MatchResult instances on the _Assignment records, matching is limited
 *  to the *incremental* matching on just the new assignment, not a full match on all keys in the
 *  context.
 *
 * Further, a MatchResult caches the *property map* resulting from the application of the rules
 *  that it matches.  By caching MatchResult objects (and caching the map from
 *  Rule vector (AKA Match) -> MatchResult -> PropertyMap), redudant rule application (and creation
 * of additional property maps) is avoided.
 */
var  /**
 *  MatchResult represents the result of computing the set of matching rules
 *  based on the key/value on this instance, and the other key/value pairs
 * on its predecessor chain.  I.e. to find the matching rules for the context keys
 * {operation=edit; layout=Inspect; class=Foo}, first a MatchResult is created for
 * 'operation=edit' and passed as the 'prev' to the creation of another for 'layout=Inspect',
 * and so on.  In this way the MatchResults form a *(sharable) partial-match tree.*
 *
 * The ability to result previous partial match 'paths' is an important optimization:
 * the primary client of MatchResult (and of rule matching in general) is the Context, when each
 * assignment pushes a record on a stack that (roughly) extends the Match from the previous
 * assignment.  By caching MatchResult instances on the _Assignment records, matching is limited
 *  to the *incremental* matching on just the new assignment, not a full match on all keys in the
 *  context.
 *
 * Further, a MatchResult caches the *property map* resulting from the application of the rules
 *  that it matches.  By caching MatchResult objects (and caching the map from
 *  Rule vector (AKA Match) -> MatchResult -> PropertyMap), redudant rule application (and creation
 * of additional property maps) is avoided.
 */
MatchResult = /** @class */ (function (_super) {
    __extends(MatchResult, _super);
    // Meta meta, Meta.KeyData keyData, Object value, MatchResult prev)
    function MatchResult(_meta, _keyData, _value, _prevMatch) {
        var _this = _super.call(this, null, null, 0, (_prevMatch != null) ? _prevMatch._overUnionMatch : null) || this;
        _this._meta = _meta;
        _this._keyData = _keyData;
        _this._value = _value;
        _this._prevMatch = _prevMatch;
        _this._metaGeneration = 0;
        _this._initMatch();
        return _this;
    }
    /**
     * @param {?} over
     * @return {?}
     */
    MatchResult.prototype.setOverridesMatch = /**
     * @param {?} over
     * @return {?}
     */
    function (over) {
        this._overUnionMatch = over;
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.matches = /**
     * @return {?}
     */
    function () {
        this._invalidateIfStale();
        if (isBlank(this._matches)) {
            this._initMatch();
        }
        return this._matches;
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.filterResult = /**
     * @return {?}
     */
    function () {
        return this.filter(this._meta._rules, this._meta._ruleCount, this.matches(), this._keysMatchedMask, null);
    };
    /**
     * Fill in matchArray with MatchValues to use in Selector matching
     * @param matchArray
     */
    /**
     * Fill in matchArray with MatchValues to use in Selector matching
     * @param {?} matchArray
     * @return {?}
     */
    MatchResult.prototype.initMatchValues = /**
     * Fill in matchArray with MatchValues to use in Selector matching
     * @param {?} matchArray
     * @return {?}
     */
    function (matchArray) {
        if (isPresent(this._prevMatch)) {
            this._prevMatch.initMatchValues(matchArray);
        }
        if (isPresent(this._overUnionMatch)) {
            this._overUnionMatch.initMatchValues(matchArray);
        }
        this._meta.matchArrayAssign(matchArray, this._keyData, this._keyData.matchValue(this._value));
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.filteredMatches = /**
     * @return {?}
     */
    function () {
        // shouldn't this be cached?!?
        var /** @type {?} */ matches = this.matches();
        var /** @type {?} */ keysMatchedMask = this._keysMatchedMask | (isPresent(this._overUnionMatch) ? this._overUnionMatch._keysMatchedMask : 0);
        var /** @type {?} */ overrideMatches;
        if (isPresent(this._overUnionMatch) && isPresent((overrideMatches = this._overUnionMatch.matches()))) {
            if (isBlank(matches)) {
                matches = overrideMatches;
            }
            else {
                matches = Match.intersect(this._meta._rules, matches, overrideMatches, this._keysMatchedMask, this._overUnionMatch._keysMatchedMask);
            }
        }
        var /** @type {?} */ matchArray;
        if (Meta._UsePartialIndexing) {
            matchArray = this._meta.newMatchArray();
            this.initMatchValues(matchArray);
        }
        return this.filter(this._meta._rules, this._meta._ruleCount, matches, keysMatchedMask, matchArray);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    MatchResult.prototype.valueForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return (this._keyData._key === key) ? this._value :
            (isPresent(this._prevMatch) ? this._prevMatch.valueForKey(key) : null);
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.immutableCopy = /**
     * @return {?}
     */
    function () {
        this._invalidateIfStale();
        return new MatchWithUnion(this.matches(), this._keysMatchedMask, this._matchPathCRC, this._overUnionMatch);
    };
    /**
     * @return {?}
     */
    MatchResult.prototype._invalidateIfStale = /**
     * @return {?}
     */
    function () {
        if (this._metaGeneration < this._meta.ruleSetGeneration) {
            this._initMatch();
        }
    };
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} aMask
     * @param {?} bMask
     * @return {?}
     */
    MatchResult.prototype.join = /**
     * @param {?} a
     * @param {?} b
     * @param {?} aMask
     * @param {?} bMask
     * @return {?}
     */
    function (a, b, aMask, bMask) {
        return Match.intersect(this._meta._rules, a, b, aMask, bMask);
    };
    /**
     * @return {?}
     */
    MatchResult.prototype._initMatch = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ keyMask = shiftLeft(1, this._keyData._id);
        // get vec for this key/value -- if value is list, compute the union
        var /** @type {?} */ newArr;
        if (isArray(this._value)) {
            try {
                for (var _a = __values(this._value), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var v = _b.value;
                    var /** @type {?} */ a = this._keyData.lookup(this._meta, v);
                    newArr = Match.union(a, newArr);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            newArr = this._keyData.lookup(this._meta, this._value);
        }
        var /** @type {?} */ prevMatches = (isBlank(this._prevMatch)) ? null : this._prevMatch.matches();
        this._keysMatchedMask = (isBlank(this._prevMatch)) ? keyMask : (keyMask | this._prevMatch._keysMatchedMask);
        if (isBlank(prevMatches)) {
            this._matches = newArr;
            // Todo: not clear why this is needed, but without it we end up failing to filter
            // certain matches that should be filtered (resulting in bad matches)
            if (!Meta._UsePartialIndexing) {
                this._keysMatchedMask = keyMask;
            }
        }
        else {
            if (isBlank(newArr)) {
                newArr = Match.EmptyMatchArray;
            }
            // Join
            this._matches = this.join(newArr, prevMatches, keyMask, this._prevMatch._keysMatchedMask);
        }
        // compute path CRC
        this._matchPathCRC = -1;
        for (var /** @type {?} */ mr = this; mr != null; mr = mr._prevMatch) {
            this._matchPathCRC = crc32(this._matchPathCRC, mr._keyData._key.length);
            if (isPresent(mr._value)) {
                var /** @type {?} */ value = isArray(mr._value) ? mr._value.join(',') : mr._value;
                this._matchPathCRC = crc32(this._matchPathCRC, hashCode(value));
            }
        }
        if (this._matchPathCRC === 0) {
            this._matchPathCRC = 1;
        }
        this._metaGeneration = this._meta.ruleSetGeneration;
        this._properties = null;
        var e_1, _c;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    MatchResult.prototype._logMatchDiff = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        var /** @type {?} */ iA = 1, /** @type {?} */ sizeA = a[0], /** @type {?} */ iB = 1, /** @type {?} */ sizeB = b[0];
        while (iA <= sizeA || iB <= sizeB) {
            var /** @type {?} */ c = (iA > sizeA ? 1 : (iB > sizeB ? -1 : (a[iA] - b[iB])));
            if (c === 0) {
                iA++;
                iB++;
            }
            else if (c < 0) {
                // If A not in B, but A doesn't filter on B's mask, then add it
                print('  -- Only in A: ' + this._meta._rules[a[iA]]);
                iA++;
            }
            else {
                print('  -- Only in B: ' + this._meta._rules[b[iB]]);
                iB++;
            }
        }
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.properties = /**
     * @return {?}
     */
    function () {
        this._invalidateIfStale();
        if (isBlank(this._properties)) {
            this._properties = this._meta.propertiesForMatch(this);
        }
        return this._properties;
    };
    /**
     * @return {?}
     */
    MatchResult.prototype.debugString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['Match Result path: \n']);
        this._appendPrevPath(sj);
        if (isPresent(this._overUnionMatch)) {
            sj.add('\nOverrides path: ');
            this._overUnionMatch._appendPrevPath(sj);
        }
        return sj.toString();
    };
    /**
     * @param {?} buf
     * @return {?}
     */
    MatchResult.prototype._appendPrevPath = /**
     * @param {?} buf
     * @return {?}
     */
    function (buf) {
        if (isPresent(this._prevMatch)) {
            this._prevMatch._appendPrevPath(buf);
            buf.add(' -> ');
        }
        buf.add(this._keyData._key);
        buf.add('=');
        buf.add(this._value);
    };
    /**
     * @param {?} values
     * @param {?} meta
     * @return {?}
     */
    MatchResult.prototype._checkMatch = /**
     * @param {?} values
     * @param {?} meta
     * @return {?}
     */
    function (values, meta) {
        var /** @type {?} */ arr = this.filterResult();
        if (isBlank(arr)) {
            return;
        }
        // first entry is count
        var /** @type {?} */ count = arr[0];
        for (var /** @type {?} */ i = 0; i < count; i++) {
            var /** @type {?} */ r = this._meta._rules[arr[i + 1]];
            r._checkRule(values, meta);
        }
    };
    /**
     * @param {?} o
     * @return {?}
     */
    MatchResult.prototype.equalsTo = /**
     * @param {?} o
     * @return {?}
     */
    function (o) {
        return (o instanceof MatchResult) && _super.prototype.equalsTo.call(this, o) && (o._metaGeneration === this._metaGeneration) &&
            o._properties.size === this._properties.size;
    };
    return MatchResult;
}(MatchWithUnion));
var UnionMatchResult = /** @class */ (function (_super) {
    __extends(UnionMatchResult, _super);
    function UnionMatchResult(meta, keyData, value, prevMatch) {
        return _super.call(this, meta, keyData, value, prevMatch) || this;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} aMask
     * @param {?} bMask
     * @return {?}
     */
    UnionMatchResult.prototype.join = /**
     * @param {?} a
     * @param {?} b
     * @param {?} aMask
     * @param {?} bMask
     * @return {?}
     */
    function (a, b, aMask, bMask) {
        return Match.union(a, b);
    };
    return UnionMatchResult;
}(MatchResult));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * A map that masks on top of an (immutable) parent map
 * @template K, V
 */
var NestedMap = /** @class */ (function () {
    function NestedMap(_parent, _map) {
        this._parent = _parent;
        this._map = _map;
        this._overrideCount = 0;
        this._size = 0;
        if (isBlank(_map)) {
            this._map = new Map();
        }
    }
    /**
     * @param {?} iteratorResult
     * @return {?}
     */
    NestedMap.toMapEntry = /**
     * @param {?} iteratorResult
     * @return {?}
     */
    function (iteratorResult) {
        var /** @type {?} */ value = iteratorResult.value;
        if (isPresent(value) && NestedMap.isMapEntry(value)) {
            return value;
        }
        var /** @type {?} */ entry = {
            key: (isPresent(iteratorResult.value)) ? iteratorResult.value[0] : iteratorResult.value,
            value: (isPresent(iteratorResult.value)) ? iteratorResult.value[1] : iteratorResult.value,
            hasNext: !iteratorResult.done
        };
        return entry;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NestedMap.isMapEntry = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return isPresent(value) && isPresent(value.hasNext);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NestedMap.isNMNullMarker = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return isPresent(value) && value['nesnullmarker'];
    };
    /**
     * @return {?}
     */
    NestedMap.prototype.toMap = /**
     * @return {?}
     */
    function () {
        return this._parent;
    };
    /**
     * @param {?} newParent
     * @return {?}
     */
    NestedMap.prototype.reparentedMap = /**
     * @param {?} newParent
     * @return {?}
     */
    function (newParent) {
        var /** @type {?} */ newMap = new NestedMap(newParent, this._map);
        newMap._overrideCount = this._overrideCount;
        return newMap;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    NestedMap.prototype.get = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ val = this._map.has(key) ? this._map.get(key) : this._parent.get(key);
        return NestedMap.isNMNullMarker(val) ? null : val;
    };
    /**
     * @return {?}
     */
    NestedMap.prototype.keys = /**
     * @return {?}
     */
    function () {
        return unimplemented();
    };
    /**
     * @return {?}
     */
    NestedMap.prototype.values = /**
     * @return {?}
     */
    function () {
        return unimplemented();
    };
    /**
     * @return {?}
     */
    NestedMap.prototype.clear = /**
     * @return {?}
     */
    function () {
        this._parent.clear();
        this._map.clear();
    };
    /**
     * @param {?} key
     * @param {?=} value
     * @return {?}
     */
    NestedMap.prototype.set = /**
     * @param {?} key
     * @param {?=} value
     * @return {?}
     */
    function (key, value) {
        var /** @type {?} */ orig = this._map.get(key);
        if ((NestedMap.isNMNullMarker(orig) || isBlank(orig)) && this._parent.has(key)) {
            this._overrideCount += (NestedMap.isNMNullMarker(orig) ? -1 : 1);
        }
        this._map.set(key, value);
        return this;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    NestedMap.prototype.delete = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ returnVal = false;
        var /** @type {?} */ orig = null;
        if (this._map.has(key)) {
            orig = this._map.delete(key);
            returnVal = true;
            // print('Removing: ' , orig);
            if (this._parent.has(key)) {
                this._map.set(key, NestedMap._NullMarker);
                // _overrideCount--;
                this._overrideCount++;
            }
        }
        else if (this._parent.has(key)) {
            // we're "removing" a value we don't have (but that our parent does)
            // we need to store a null override
            orig = this._parent.get(key);
            // print('Removing: ' , orig);
            this._map.set(key, NestedMap._NullMarker);
            this._overrideCount += 2;
        }
        return returnVal;
    };
    /**
     * @param {?} callbackfn
     * @param {?=} thisArg
     * @return {?}
     */
    NestedMap.prototype.forEach = /**
     * @param {?} callbackfn
     * @param {?=} thisArg
     * @return {?}
     */
    function (callbackfn, thisArg) {
        var /** @type {?} */ entries = this.entries();
        var /** @type {?} */ nextEntry;
        while ((nextEntry = NestedMap.toMapEntry(entries.next())) && nextEntry.hasNext) {
            callbackfn(nextEntry.value, nextEntry.key, this._parent);
        }
    };
    /**
     * @param {?} key
     * @return {?}
     */
    NestedMap.prototype.has = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._map.has(key) ? (!NestedMap.isNMNullMarker(this._map.get(key))) : this._parent.has(key);
    };
    /**
     * @return {?}
     */
    NestedMap.prototype[Symbol.iterator] = /**
     * @return {?}
     */
    function () {
        return new NestedEntryIterator(this);
    };
    /**
     * @return {?}
     */
    NestedMap.prototype.entries = /**
     * @return {?}
     */
    function () {
        return new NestedEntryIterator(this);
    };
    Object.defineProperty(NestedMap.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._parent.size + this._map.size - this._overrideCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NestedMap.prototype, "map", {
        get: /**
         * @return {?}
         */
        function () {
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NestedMap.prototype, "parent", {
        get: /**
         * @return {?}
         */
        function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NestedMap.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'NestedMap';
    };
    NestedMap._NullMarker = { nesnullmarker: true };
    return NestedMap;
}());
/**
 * @template K, V
 */
var /**
 * @template K, V
 */
NestedEntryIterator = /** @class */ (function () {
    function NestedEntryIterator(_nestedMap) {
        this._nestedMap = _nestedMap;
        this._parentIterator = _nestedMap.parent.entries();
        this._nestedIterator = _nestedMap.map.entries();
        this.advanceToNext();
    }
    /**
     * @return {?}
     */
    NestedEntryIterator.prototype.next = /**
     * @return {?}
     */
    function () {
        // assert(isPresent(this._nextEntry) , 'next() when no more elements"');
        this._currentEntry = this._nextEntry;
        this.advanceToNext();
        var /** @type {?} */ next = {
            value: this._currentEntry,
            done: !this._currentEntry.hasNext
        };
        return next;
    };
    /**
     * @return {?}
     */
    NestedEntryIterator.prototype[Symbol.iterator] = /**
     * @return {?}
     */
    function () {
        return this;
    };
    /**
     * @return {?}
     */
    NestedEntryIterator.prototype.advanceToNext = /**
     * @return {?}
     */
    function () {
        this._fromNested = false;
        // Note: we need to skip nulls (masked values)
        while (!this._fromNested && (this._currentNestedEntry = NestedMap.toMapEntry(this._nestedIterator.next())) && this._currentNestedEntry.hasNext) {
            this._nextEntry = this._currentNestedEntry;
            if (!NestedMap.isNMNullMarker(this._nextEntry.value)) {
                this._fromNested = true;
            }
        }
        if (!this._fromNested) {
            while ((this._currentParentEntry = NestedMap.toMapEntry(this._parentIterator.next())) && this._currentParentEntry.hasNext) {
                this._nextEntry = this._currentParentEntry;
                if (!this._nestedMap.map.has(this._nextEntry.key)) {
                    return;
                }
            }
            this._nextEntry = this._currentParentEntry;
        }
    };
    return NestedEntryIterator;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var  /**
 * @abstract
 */
DynamicPropertyValue = /** @class */ (function () {
    function DynamicPropertyValue() {
    }
    /**
     * @param {?} context
     * @return {?}
     */
    DynamicPropertyValue.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return unimplemented();
    };
    /**
     * @param {?} context
     * @return {?}
     */
    DynamicPropertyValue.prototype.bind = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return unimplemented();
    };
    return DynamicPropertyValue;
}());
/**
 * ;marker; interface for DynamicPropertyValues that depend only on their match context and
 * therefore can be computed and cached statically in the Context Activation tree
 */
var  /**
 * ;marker; interface for DynamicPropertyValues that depend only on their match context and
 * therefore can be computed and cached statically in the Context Activation tree
 */
StaticallyResolvable = /** @class */ (function (_super) {
    __extends(StaticallyResolvable, _super);
    function StaticallyResolvable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StaticallyResolvable;
}(DynamicPropertyValue));
var StaticDynamicWrapper = /** @class */ (function (_super) {
    __extends(StaticDynamicWrapper, _super);
    function StaticDynamicWrapper(_orig) {
        var _this = _super.call(this) || this;
        _this._orig = _orig;
        _this.propertyAwaking = true;
        return _this;
    }
    /**
     * @return {?}
     */
    StaticDynamicWrapper.prototype.getDynamicValue = /**
     * @return {?}
     */
    function () {
        return this._orig;
    };
    /**
     * @param {?} map
     * @return {?}
     */
    StaticDynamicWrapper.prototype.awakeForPropertyMap = /**
     * @param {?} map
     * @return {?}
     */
    function (map) {
        // copy ourselves so there's a fresh copy for each context in which is appears
        var /** @type {?} */ origaw = (isPropertyMapAwaking(this._orig)) ? /** @type {?} */ ((/** @type {?} */ (this._orig)).awakeForPropertyMap(map)) : this._orig;
        return new StaticDynamicWrapper(origaw);
    };
    /**
     * @param {?} context
     * @return {?}
     */
    StaticDynamicWrapper.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        // we lazily static evaluate our value and cache the result
        if (isBlank(this._cached)) {
            this._cached = context.staticallyResolveValue(this._orig);
        }
        return this._cached;
    };
    /**
     * @return {?}
     */
    StaticDynamicWrapper.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['StaticDynamicWrapper']);
        sj.add('(');
        sj.add(((isPresent(this._cached)) ? this._cached : this._orig));
        sj.add(((isBlank(this._cached)) ? ' unevaluated' : ''));
        sj.add(')');
        return sj.toString();
    };
    return StaticDynamicWrapper;
}(StaticallyResolvable));
var StaticallyResolvableWrapper = /** @class */ (function (_super) {
    __extends(StaticallyResolvableWrapper, _super);
    function StaticallyResolvableWrapper(_orig) {
        var _this = _super.call(this) || this;
        _this._orig = _orig;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    StaticallyResolvableWrapper.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this._orig.evaluate(context);
    };
    /**
     * @return {?}
     */
    StaticallyResolvableWrapper.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['StaticallyResolvableWrapper']);
        sj.add('(');
        sj.add(this._orig.toString());
        sj.add(')');
        return sj.toString();
    };
    return StaticallyResolvableWrapper;
}(StaticallyResolvable));
var ContextFieldPath = /** @class */ (function (_super) {
    __extends(ContextFieldPath, _super);
    function ContextFieldPath(path) {
        var _this = _super.call(this) || this;
        _this.settable = true;
        _this.fieldPath = new FieldPath(path);
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    ContextFieldPath.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this.fieldPath.getFieldValue(context);
    };
    /**
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    ContextFieldPath.prototype.evaluateSet = /**
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    function (context, value) {
        this.fieldPath.setFieldValue(context, value);
    };
    return ContextFieldPath;
}(DynamicPropertyValue));
/**
 * @param {?} arg
 * @return {?}
 */
function isDynamicSettable(arg) {
    return isPresent(arg.settable);
}
var Expr = /** @class */ (function (_super) {
    __extends(Expr, _super);
    function Expr(_expressionString) {
        var _this = _super.call(this) || this;
        _this._expressionString = _expressionString;
        _this._extendedObjects = new Map();
        _this.addTypeToContext('Meta', Meta);
        _this.addTypeToContext('FieldPath', FieldPath);
        return _this;
    }
    /**
     * @param {?} name
     * @param {?} context
     * @return {?}
     */
    Expr.prototype.addTypeToContext = /**
     * @param {?} name
     * @param {?} context
     * @return {?}
     */
    function (name, context) {
        if (isFunction(context)) {
            this._extendedObjects.set(name, context);
        }
    };
    /**
     * @param {?} context
     * @return {?}
     */
    Expr.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var _this = this;
        var /** @type {?} */ index = 0;
        this._extendedObjects.forEach(function (v, k) {
            var /** @type {?} */ typeName = "DynObj" + index++;
            (/** @type {?} */ (context))[typeName] = v;
            if (_this._expressionString.indexOf(k + ".") !== -1) {
                _this._expressionString = _this._expressionString.replace(k + ".", typeName + ".");
            }
        });
        var /** @type {?} */ result = evalExpressionWithCntx(this._expressionString, '', context, context);
        index = 0;
        this._extendedObjects.forEach(function (v, k) {
            var /** @type {?} */ typeName = "DynObj" + index++;
            if (isPresent((/** @type {?} */ (context))[typeName])) {
                delete (/** @type {?} */ (context))[typeName];
                // check if we can use undefined. Delete is pretty slow
            }
        });
        return result;
    };
    /**
     * @return {?}
     */
    Expr.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['expr:']);
        sj.add('(');
        sj.add(this._expressionString);
        sj.add(')');
        return sj.toString();
    };
    return Expr;
}(DynamicPropertyValue));
var DeferredOperationChain = /** @class */ (function (_super) {
    __extends(DeferredOperationChain, _super);
    function DeferredOperationChain(_merger, _orig, _override) {
        var _this = _super.call(this) || this;
        _this._merger = _merger;
        _this._orig = _orig;
        _this._override = _override;
        _this.propertyAwaking = true;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    DeferredOperationChain.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this._merger.merge(context.resolveValue(this._override), context.resolveValue(this._orig), context.isDeclare());
    };
    /**
     * @param {?} map
     * @return {?}
     */
    DeferredOperationChain.prototype.awakeForPropertyMap = /**
     * @param {?} map
     * @return {?}
     */
    function (map) {
        var /** @type {?} */ orig = this._orig;
        var /** @type {?} */ over = this._override;
        if (isPropertyMapAwaking(orig)) {
            orig = (/** @type {?} */ (orig)).awakeForPropertyMap(map);
        }
        if (isPropertyMapAwaking(over)) {
            over = (/** @type {?} */ (over)).awakeForPropertyMap(map);
        }
        if (orig !== this._orig || over !== this._override) {
            return new DeferredOperationChain(this._merger, orig, over);
        }
        return this;
    };
    /**
     * @return {?}
     */
    DeferredOperationChain.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['Chain']);
        sj.add('<');
        sj.add(this._merger.toString());
        sj.add('>');
        sj.add(': ');
        sj.add(this._override);
        sj.add(' => ');
        sj.add(this._orig);
        return sj.toString();
    };
    return DeferredOperationChain;
}(DynamicPropertyValue));
var ValueConverter = /** @class */ (function () {
    function ValueConverter() {
    }
    /**
     * @param {?} toType
     * @param {?} value
     * @return {?}
     */
    ValueConverter.value = /**
     * @param {?} toType
     * @param {?} value
     * @return {?}
     */
    function (toType, value) {
        if (toType === 'String') {
            if (isBlank(value) || isString(value)) {
                return value;
            }
            return value.toString();
        }
        else if (toType === 'Boolean') {
            if (isBlank(value) || isBoolean(value)) {
                return value;
            }
            return BooleanWrapper.boleanValue(value);
        }
        else if (toType === 'Number') {
            if (isBlank(value) || isNumber(value)) {
                return value;
            }
            // ignore dec. points for now
            return parseInt(value.toString());
        }
        return value;
    };
    return ValueConverter;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *
 * Context represents a stack of assignments (e.g. class=User, field=birthDay, operation=edit)
 *  The current set of assignments can be retrieved via values().
 *
 * The current values are run against the Meta rule set to compute the effective PropertyMap
 * (e.g. visible:true, editable:true, component:AWTextField).
 * Some rule evaluations result in *chaining* -- where additional assignments that are
 * 'implied' by the current assignments are applied, (resulting in a revised computation
 * of the current PropertyMap, and possible further chaining).
 * (e.g. field=birthDay may result in type=Date which may result in component:DatePicker)
 *
 * Assignments can be scoped and popped (push(), set(key, value); ...; pop()).
 *
 * The actual computation of rule matches is cached so once a 'path' down the context
 * tree has been exercized subsequent matching traversals (even by other threads/users)
 * is fast.
 *
 *
 * examples of property maps for different scope key
 *
 * <code>
 *     {
 * 'visible': true,
 * 'class_trait': 'fiveZones',
 * 'editable': true,
 * 'bindings': {
 * 'value': 'Default Title'
 * },
 * 'field_trait': 'required',
 * 'label': 'Title',
 * 'type': 'string',
 * 'required': true,
 * 'editing': true,
 * 'valid': '{{(value && value.length > 0) ? true : \'Answer required\'}}',
 * 'component': 'InputFieldComponent',
 * 'field': 'title',
 * 'layout_trait': 'Form',
 * 'trait': 'required',
 * 'rank': 20,
 * 'after': 'zLeft',
 * 'class': 'CheckRequest1'
 * }
 *
 * </code>
 *
 *
 *
 * <code>
 *     {
 * 'visible': true,
 * 'class_trait': 'fiveZones',
 * 'label': 'Check Request1',
 * 'zones': [
 * 'zLeft',
 * 'zRight',
 * 'zTop',
 * 'zBottom',
 * 'zDetail'
 * ],
 * 'editing': true,
 * 'layout': '*',
 * 'component': 'MetaFormComponent',
 * 'layout_trait': 'Form',
 * 'fiveZoneLayout': true,
 * 'trait': 'fiveZones',
 * 'layoutsByZone': {
 * },
 * 'class': 'CheckRequest1',
 * 'fieldsByZone': {
 * 'zLeft': [
 * 'title',
 * 'name'
 * ],
 * 'zNone': [
 * 'fullName'
 * ]
 * }
 * }
 *
 * </code>
 *
 *
 *
 */
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context(_meta, nested) {
        if (nested === void 0) { nested = false; }
        var _this = _super.call(this) || this;
        _this._meta = _meta;
        _this.nested = nested;
        _this._values = new Map();
        _this._entries = [];
        _this._frameStarts = [];
        _this._recPool = [];
        if (isBlank(Context.EmptyMap)) {
            Context.EmptyMap = new PropertyMap();
        }
        Context._Debug_SetsCount = 0;
        _this._accessor = new PropertyAccessor(_this);
        _this._currentActivation = Context.getActivationTree(_meta);
        _this._rootNode = _this._currentActivation;
        _this.isNested = nested;
        return _this;
    }
    /**
     * Implementation notes:
     *
     * Context maintains a stack (_entries) of _ContextRecs (one per assignment) as well as
     * as _frameStack recording the stack positions for each push()/pop().

     * Performance through aggressive global caching of all statically computatble data:
     * - The static (reusable/immutable) part of a ContextRec is factored into _StaticRec
     * - StaticRecs represent individual assignments (context key = value) and cache the
     *      resulting Meta.MatchResult (and associated PropertyMap)
     * - The sub-stack (of forward chained) records associated with each external set()
     *      (or chained *dynamic* value) is recorded in an Activation.
     * - Process-global tree of Activations
     *      - each activation keeps list of its ContextKey/Value-keyed decended Activations
     *
     * Property Contexts.
     *      The notion of a 'PropertyContext' makes the going tricky...
     *       A 'PropertyContextKey' is a key for an 'entity' that properties describe.
     *       (e.g. class, field, action, and layout are property context keys, but editing,
     *       operation, ... are not)
     *       E.g. On an assignment stack with module=Admin class=Foo, field=name, editable=false,
     *       we want the property 'label' to be the label for the *field*, not the class or module
     *       -- i.e. the *top-most* assignment of a PropertyContextKey determines which property
     *       context rules are active.
     *
     *  These rules are activated via a synthetic context key of like 'field_p' or 'class_p'.
     *  Logically, after each assigment we need to figure of which context key should be in
     *  affect an set it on the context, but then automatically pop it off upon the next
     *  assignment (and then recompute again).
     *
     *  Of course, actually pushing and popping context key assignment on every set()
     *  would be expensive so instead we cache the 'propertyActivation' associated with
     *  each activation, and use its values and properties rather than those on the
     *  activation.
     */
    /**
     * Implementation notes:
     *
     * Context maintains a stack (_entries) of _ContextRecs (one per assignment) as well as
     * as _frameStack recording the stack positions for each push()/pop().
     * Performance through aggressive global caching of all statically computatble data:
     * - The static (reusable/immutable) part of a ContextRec is factored into _StaticRec
     * - StaticRecs represent individual assignments (context key = value) and cache the
     *      resulting Meta.MatchResult (and associated PropertyMap)
     * - The sub-stack (of forward chained) records associated with each external set()
     *      (or chained *dynamic* value) is recorded in an Activation.
     * - Process-global tree of Activations
     *      - each activation keeps list of its ContextKey/Value-keyed decended Activations
     *
     * Property Contexts.
     *      The notion of a 'PropertyContext' makes the going tricky...
     *       A 'PropertyContextKey' is a key for an 'entity' that properties describe.
     *       (e.g. class, field, action, and layout are property context keys, but editing,
     *       operation, ... are not)
     *       E.g. On an assignment stack with module=Admin class=Foo, field=name, editable=false,
     *       we want the property 'label' to be the label for the *field*, not the class or module
     *       -- i.e. the *top-most* assignment of a PropertyContextKey determines which property
     *       context rules are active.
     *
     *  These rules are activated via a synthetic context key of like 'field_p' or 'class_p'.
     *  Logically, after each assigment we need to figure of which context key should be in
     *  affect an set it on the context, but then automatically pop it off upon the next
     *  assignment (and then recompute again).
     *
     *  Of course, actually pushing and popping context key assignment on every set()
     *  would be expensive so instead we cache the 'propertyActivation' associated with
     *  each activation, and use its values and properties rather than those on the
     *  activation.
     * @param {?} meta
     * @return {?}
     */
    Context.getActivationTree = /**
     * Implementation notes:
     *
     * Context maintains a stack (_entries) of _ContextRecs (one per assignment) as well as
     * as _frameStack recording the stack positions for each push()/pop().
     * Performance through aggressive global caching of all statically computatble data:
     * - The static (reusable/immutable) part of a ContextRec is factored into _StaticRec
     * - StaticRecs represent individual assignments (context key = value) and cache the
     *      resulting Meta.MatchResult (and associated PropertyMap)
     * - The sub-stack (of forward chained) records associated with each external set()
     *      (or chained *dynamic* value) is recorded in an Activation.
     * - Process-global tree of Activations
     *      - each activation keeps list of its ContextKey/Value-keyed decended Activations
     *
     * Property Contexts.
     *      The notion of a 'PropertyContext' makes the going tricky...
     *       A 'PropertyContextKey' is a key for an 'entity' that properties describe.
     *       (e.g. class, field, action, and layout are property context keys, but editing,
     *       operation, ... are not)
     *       E.g. On an assignment stack with module=Admin class=Foo, field=name, editable=false,
     *       we want the property 'label' to be the label for the *field*, not the class or module
     *       -- i.e. the *top-most* assignment of a PropertyContextKey determines which property
     *       context rules are active.
     *
     *  These rules are activated via a synthetic context key of like 'field_p' or 'class_p'.
     *  Logically, after each assigment we need to figure of which context key should be in
     *  affect an set it on the context, but then automatically pop it off upon the next
     *  assignment (and then recompute again).
     *
     *  Of course, actually pushing and popping context key assignment on every set()
     *  would be expensive so instead we cache the 'propertyActivation' associated with
     *  each activation, and use its values and properties rather than those on the
     *  activation.
     * @param {?} meta
     * @return {?}
     */
    function (meta) {
        // todo: check the syntax Actionvation contructor name.
        var /** @type {?} */ name = objectToName(Activation);
        var /** @type {?} */ root = meta.identityCache.getValue(name);
        if (isBlank(root)) {
            root = new Activation();
            meta.identityCache.setValue(name, root);
        }
        return root;
    };
    /**
     * @return {?}
     */
    Context.prototype.push = /**
     * @return {?}
     */
    function () {
        this._frameStarts.push(this._entries.length);
    };
    Object.defineProperty(Context.prototype, "meta", {
        get: /**
         * @return {?}
         */
        function () {
            return this._meta;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Context.prototype.pop = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ size = this._frameStarts.length;
        assert(size > 0, 'Popping empty stack');
        var /** @type {?} */ pos = this._frameStarts.pop();
        var /** @type {?} */ entriesSize;
        while ((entriesSize = this._entries.length) > pos) {
            var /** @type {?} */ recIdx = entriesSize - 1;
            var /** @type {?} */ rec = this._entries.splice(recIdx, 1)[0];
            if (rec.srec.lastAssignmentIdx === -1) {
                this._values.delete(rec.srec.key);
            }
            else {
                this._undoOverride(rec, recIdx);
            }
            this._currentActivation = (recIdx > 0)
                ? this._entries[recIdx - 1].srec.activation
                : this._rootNode;
            this.assertContextConsistent();
            // check rec back into pool for reuse
            rec.reset();
            this._recPool.push(rec);
        }
        this._currentProperties = null;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Context.prototype.set = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        var _this = this;
        this._set(key, value, false, false);
        // implement default toString for our object so we can retrieve objectTitle
        if (key === ObjectMeta.KeyObject) {
            var /** @type {?} */ toCheck = this._values.get(ObjectMeta.KeyObject);
            if (isBlank(toCheck['$toString'])) {
                toCheck['$toString'] = function () {
                    var /** @type {?} */ clazz = _this.values.get(ObjectMeta.KeyClass);
                    return UIMeta.beautifyClassName(clazz);
                };
            }
        }
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Context.prototype.merge = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        this._set(key, value, true, false);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Context.prototype.setScopeKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        assert(this._meta.keyData(key).isPropertyScope, key + ' is not a valid context key');
        var /** @type {?} */ current = this._currentPropertyScopeKey();
        // Assert.that(current != null, 'Can't set %s as context key when no context key on stack',
        // key); TODO: if current key isChaining then we need to set again to get a non-chaining
        // assignment
        if (!(key === current)) {
            var /** @type {?} */ val = this.values.get(key);
            // Assert.that(val != null, 'Can't set %s as context key when it has no value already
            // on the context', key);
            if (isBlank(val)) {
                val = Meta.KeyAny;
            }
            this.set(key, val);
        }
    };
    Object.defineProperty(Context.prototype, "values", {
        get: /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ propVals;
            return (ListWrapper.isEmpty(this._entries) ||
                isBlank(propVals = (ListWrapper.last(this._entries)).propertyLocalValues(this))) ? this._values : propVals;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "properties", {
        get: /**
         * @return {?}
         */
        function () {
            return this._accessor;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} key
     * @return {?}
     */
    Context.prototype.propertyForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ val = this.allProperties().get(key);
        return this.resolveValue(val);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Context.prototype.listPropertyForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ val = this.propertyForKey(key);
        return (isBlank(val)) ? [] : (isArray(val)) ? val : [val];
    };
    /**
     * @param {?} key
     * @param {?} defaultVal
     * @return {?}
     */
    Context.prototype.booleanPropertyForKey = /**
     * @param {?} key
     * @param {?} defaultVal
     * @return {?}
     */
    function (key, defaultVal) {
        var /** @type {?} */ val = this.propertyForKey(key);
        return (isBlank(val)) ? defaultVal : BooleanWrapper.boleanValue(val);
    };
    /**
     * @return {?}
     */
    Context.prototype.allProperties = /**
     * @return {?}
     */
    function () {
        if (isBlank(this._currentProperties)) {
            var /** @type {?} */ m = this.lastMatch();
            if (isPresent(m)) {
                this._currentProperties = m.properties();
            }
        }
        return isPresent(this._currentProperties) ? this._currentProperties : Context.EmptyMap;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Context.prototype.resolveValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ lastValue;
        while (value !== lastValue && isPresent(value) && value instanceof DynamicPropertyValue) {
            lastValue = value;
            var /** @type {?} */ propValue = value;
            if (propValue instanceof Expr) {
                propValue.addTypeToContext('UIMeta', UIMeta);
            }
            value = propValue.evaluate(this);
        }
        return value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Context.prototype.staticallyResolveValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ lastValue = null;
        while (value !== lastValue && isPresent(value) && value instanceof StaticallyResolvable) {
            lastValue = value;
            value = value.evaluate(this);
        }
        return value;
    };
    /**
     * @param {?} contextVals
     * @param {?} propertyKey
     * @param {?} staticResolve
     * @return {?}
     */
    Context.prototype.pushAndResolveStatic = /**
     * @param {?} contextVals
     * @param {?} propertyKey
     * @param {?} staticResolve
     * @return {?}
     */
    function (contextVals, propertyKey, staticResolve) {
        var _this = this;
        var /** @type {?} */ scopeKey;
        this.push();
        MapWrapper.iterable(contextVals).forEach(function (value, key) {
            if ('*' === value) {
                scopeKey = key;
            }
            else {
                _this.set(key, value);
            }
        });
        if (isPresent(scopeKey)) {
            this.setScopeKey(scopeKey);
        }
        var /** @type {?} */ val = this.allProperties().get(propertyKey);
        val = staticResolve ? this.staticallyResolveValue(val) : this.resolveValue(val);
        this.pop();
        return val;
    };
    /**
     * @param {?} contextVals
     * @param {?} propertyKey
     * @return {?}
     */
    Context.prototype.pushAndResolve = /**
     * @param {?} contextVals
     * @param {?} propertyKey
     * @return {?}
     */
    function (contextVals, propertyKey) {
        return this.pushAndResolveStatic(contextVals, propertyKey, false);
    };
    // a (usable) snapshot of the current state of the context
    /**
     * @return {?}
     */
    Context.prototype.snapshot = /**
     * @return {?}
     */
    function () {
        return new Snapshot(this);
    };
    /**
     * Represent current active assignment list meaning it will not include any entries which
     * were overwritten by some late entry having the same key.
     *
     * It does not include entries that were pushed to stack from any Property -> Selector
     * propagation. This creates shell copy and ignoring all last Matches which could be from
     * some previous assignments that are now replaced with some new ones
     *
     */
    /**
     * Represent current active assignment list meaning it will not include any entries which
     * were overwritten by some late entry having the same key.
     *
     * It does not include entries that were pushed to stack from any Property -> Selector
     * propagation. This creates shell copy and ignoring all last Matches which could be from
     * some previous assignments that are now replaced with some new ones
     *
     * @return {?}
     */
    Context.prototype.activeAssignments = /**
     * Represent current active assignment list meaning it will not include any entries which
     * were overwritten by some late entry having the same key.
     *
     * It does not include entries that were pushed to stack from any Property -> Selector
     * propagation. This creates shell copy and ignoring all last Matches which could be from
     * some previous assignments that are now replaced with some new ones
     *
     * @return {?}
     */
    function () {
        var /** @type {?} */ list = new Array();
        for (var /** @type {?} */ i = 0, /** @type {?} */ c = this._entries.length; i < c; i++) {
            var /** @type {?} */ rec = this._entries[i];
            if (rec.maskedByIdx === 0 && !rec.srec.fromChaining) {
                var /** @type {?} */ a = new AssignmentSnapshot();
                a.key = rec.srec.key;
                a.value = rec.val;
                a.salience = rec.srec.salience;
                list.push(a);
            }
        }
        return list;
    };
    /**
     *
     * Similar as <code>activeAssignments</code> but do include also those that were replaced later
     * on with assignments having the same key.
     *
     * This is needed for cases where we need to have deep copy of current state along with
     * all properties.
     *
     */
    /**
     *
     * Similar as <code>activeAssignments</code> but do include also those that were replaced later
     * on with assignments having the same key.
     *
     * This is needed for cases where we need to have deep copy of current state along with
     * all properties.
     *
     * @return {?}
     */
    Context.prototype.allAssignments = /**
     *
     * Similar as <code>activeAssignments</code> but do include also those that were replaced later
     * on with assignments having the same key.
     *
     * This is needed for cases where we need to have deep copy of current state along with
     * all properties.
     *
     * @return {?}
     */
    function () {
        var /** @type {?} */ list = new Array();
        for (var /** @type {?} */ i = 0, /** @type {?} */ c = this._entries.length; i < c; i++) {
            var /** @type {?} */ rec = this._entries[i];
            if (!rec.srec.fromChaining) {
                var /** @type {?} */ a = new AssignmentSnapshot();
                a.key = rec.srec.key;
                a.value = rec.val;
                a.salience = rec.srec.salience;
                list.push(a);
            }
        }
        return list;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} merge
     * @param {?} chaining
     * @return {?}
     */
    Context.prototype._set = /**
     * @param {?} key
     * @param {?} value
     * @param {?} merge
     * @param {?} chaining
     * @return {?}
     */
    function (key, value, merge, chaining) {
        var /** @type {?} */ sval = this._meta.transformValue(key, value);
        var /** @type {?} */ didSet = false;
        var /** @type {?} */ registry = (/** @type {?} */ (this.meta)).componentRegistry;
        if (key === ObjectMeta.KeyObject && isPresent(registry)) {
            registry.registerType(className(value), value.constructor);
        }
        var /** @type {?} */ activation = this._currentActivation.getChildActivation(key, sval, chaining);
        if (isBlank(activation)) {
            didSet = this._createNewFrameForSet(key, sval, value, merge, chaining);
        }
        if (isPresent(activation)) {
            didSet = this._applyActivation(activation, value);
        }
        if (didSet) {
            this.awakeCurrentActivation();
        }
    };
    /**
     * @return {?}
     */
    Context.prototype.newContextRec = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ count = this._recPool.length;
        return (count > 0) ? this._recPool.splice(count - 1, 1)[0] : new Assignment();
    };
    /**
     * Cached case: apply a previously computed Activation
     */
    /**
     * Cached case: apply a previously computed Activation
     * @param {?} activation
     * @param {?} firstVal
     * @return {?}
     */
    Context.prototype._applyActivation = /**
     * Cached case: apply a previously computed Activation
     * @param {?} activation
     * @param {?} firstVal
     * @return {?}
     */
    function (activation, firstVal) {
        assert(activation._parent === this._currentActivation, 'Attempt to apply activation on mismatched parent');
        if (this._entries.length !== activation._origEntryCount) {
            assert(false, 'Mismatched context stack size (%s) from when activation was popped ' +
                this._entries.length + ' ' + activation._origEntryCount);
        }
        var /** @type {?} */ count = activation._recs.length;
        if (count === 0) {
            return false;
        }
        for (var /** @type {?} */ i = 0; i < count; i++) {
            var /** @type {?} */ srec = activation._recs[i];
            var /** @type {?} */ rec = this.newContextRec();
            rec.srec = srec;
            // Apply masking for any property that we mask out
            if (srec.lastAssignmentIdx !== -1) {
                this._prepareForOverride(this._entries.length, srec.lastAssignmentIdx);
            }
            rec.val = (i === 0 && !this.meta.isNullMarker(firstVal)) ? firstVal : srec.val;
            this._values.set(srec.key, rec.val);
            this._entries.push(rec);
        }
        this._currentActivation = activation;
        this._currentProperties = null;
        return true;
    };
    /**
     * @return {?}
     */
    Context.prototype.awakeCurrentActivation = /**
     * @return {?}
     */
    function () {
        // See if this activation requires further chaining
        var /** @type {?} */ currentActivation = this._currentActivation;
        var /** @type {?} */ deferredAssignments = currentActivation.deferredAssignments;
        if (isPresent(deferredAssignments)) {
            this.applyDeferredAssignments(deferredAssignments);
        }
    };
    /**
     * @param {?} deferredAssignments
     * @return {?}
     */
    Context.prototype.applyDeferredAssignments = /**
     * @param {?} deferredAssignments
     * @return {?}
     */
    function (deferredAssignments) {
        try {
            for (var deferredAssignments_1 = __values(deferredAssignments), deferredAssignments_1_1 = deferredAssignments_1.next(); !deferredAssignments_1_1.done; deferredAssignments_1_1 = deferredAssignments_1.next()) {
                var da = deferredAssignments_1_1.value;
                // verify that deferred value still applies
                var /** @type {?} */ currentPropValue = this.staticallyResolveValue(this.allProperties().get(da.key));
                if (da.value === currentPropValue) {
                    var /** @type {?} */ resolvedValue = this.resolveValue(da.value);
                    this._set(da.key, resolvedValue, false, true);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (deferredAssignments_1_1 && !deferredAssignments_1_1.done && (_a = deferredAssignments_1.return)) _a.call(deferredAssignments_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    /**
     * @return {?}
     */
    Context.prototype._inDeclare = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ match = this.lastMatchWithoutContextProps();
        return isPresent(match) && (match._keysMatchedMask & this._meta.declareKeyMask) !== 0;
    };
    /**
     Non-cached access: create a new activation
     */
    /**
     * Non-cached access: create a new activation
     * @param {?} key
     * @param {?} svalue
     * @param {?} value
     * @param {?} merge
     * @param {?} chaining
     * @return {?}
     */
    Context.prototype._createNewFrameForSet = /**
     * Non-cached access: create a new activation
     * @param {?} key
     * @param {?} svalue
     * @param {?} value
     * @param {?} merge
     * @param {?} chaining
     * @return {?}
     */
    function (key, svalue, value, merge, chaining) {
        var /** @type {?} */ lastActivation = this._currentActivation;
        var /** @type {?} */ newActivation = new Activation(lastActivation);
        newActivation._origEntryCount = this._entries.length;
        this._currentActivation = newActivation;
        // set this value
        var /** @type {?} */ didSet = this._set2(key, svalue, value, merge, chaining);
        // mirror properties
        if (didSet) {
            while (this._checkApplyProperties()) {
                /* repeat */
            }
        }
        // Remember for the future
        if (Context._CacheActivations) {
            lastActivation.cacheChildActivation(key, svalue, newActivation, chaining);
        }
        this._currentActivation = (didSet) ? newActivation : lastActivation;
        return this._currentActivation !== lastActivation;
    };
    /**
     * Called lazily to compute the property activation for this activation
     * Compute the static part of the property activation
     * we accumulate the property settings on a side activation off the main stack
     * and apply it virtually if our parent is not covered
     *  (that way we don't have to apply and unapply all the time)
     */
    /**
     * Called lazily to compute the property activation for this activation
     * Compute the static part of the property activation
     * we accumulate the property settings on a side activation off the main stack
     * and apply it virtually if our parent is not covered
     *  (that way we don't have to apply and unapply all the time)
     * @param {?} parentActivation
     * @return {?}
     */
    Context.prototype._createNewPropertyContextActivation = /**
     * Called lazily to compute the property activation for this activation
     * Compute the static part of the property activation
     * we accumulate the property settings on a side activation off the main stack
     * and apply it virtually if our parent is not covered
     *  (that way we don't have to apply and unapply all the time)
     * @param {?} parentActivation
     * @return {?}
     */
    function (parentActivation) {
        this.push();
        var /** @type {?} */ propActivation = new Activation(parentActivation);
        propActivation._origEntryCount = this._entries.length;
        this._currentActivation = propActivation;
        var /** @type {?} */ origValues = this._values;
        var /** @type {?} */ nestedMap = new NestedMap(origValues);
        this._values = nestedMap;
        this.applyPropertyContextAndChain();
        if (propActivation._recs.length > 0 || isPresent(propActivation.deferredAssignments)) {
            propActivation._nestedValues = nestedMap;
            this._values = Context.EmptyRemoveMap; // hack -- empty map so that undo is noop --
            // ((NestedMap)_values).dup();
        }
        else {
            propActivation = null;
        }
        this.pop();
        this._values = origValues;
        this._currentActivation = parentActivation;
        return propActivation;
    };
    /**
     * @param {?} propActivation
     * @param {?} rec
     * @return {?}
     */
    Context.prototype._applyPropertyActivation = /**
     * @param {?} propActivation
     * @param {?} rec
     * @return {?}
     */
    function (propActivation, rec) {
        var /** @type {?} */ propValues = this._values;
        if (isPresent(propActivation._nestedValues)) {
            propValues = propActivation._nestedValues.reparentedMap(propValues);
        }
        // set up propLocal results
        // Now, see if we need to compute a dynamic property activation as well
        if (isPresent(propActivation.deferredAssignments)) {
            this.push();
            // nest a dynamic nested map on our static nested map (which is on our last dynamic
            // nested map...)
            var /** @type {?} */ origValues = this._values;
            this._values = new NestedMap(propValues);
            this._applyActivation(propActivation, Meta.NullMarker);
            this.applyDeferredAssignments(propActivation.deferredAssignments);
            rec._propertyLocalValues = this._values;
            rec._propertyLocalSrec = ListWrapper.last(this._entries).srec;
            this._values = Context.EmptyRemoveMap; // hack -- empty map so that undo is noop --
            // ((NestedMap)_values).dup();
            this.pop();
            this._values = origValues;
        }
        else {
            // can use static versions
            rec._propertyLocalValues = propValues;
            rec._propertyLocalSrec = ListWrapper.last(propActivation._recs);
        }
    };
    // todo: any equals old va === new val
    /**
     * @param {?} oldVal
     * @param {?} newVal
     * @return {?}
     */
    Context.prototype._isNewValue = /**
     * @param {?} oldVal
     * @param {?} newVal
     * @return {?}
     */
    function (oldVal, newVal) {
        return (oldVal !== newVal && (isPresent(oldVal) ||
            (!oldVal === newVal && (!isArray(oldVal)) || !(ListWrapper.contains(oldVal, newVal)))));
    };
    /**
     * @return {?}
     */
    Context.prototype.isDeclare = /**
     * @return {?}
     */
    function () {
        return isPresent(this.propertyForKey(Meta.KeyDeclare));
    };
    /**
     * @return {?}
     */
    Context.prototype.assertContextConsistent = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!Context._ExpensiveContextConsistencyChecksEnabled) {
            return;
        }
        // Verify that each value in context has matching (enabled) context record
        MapWrapper.iterable(this._values).forEach(function (value, key) {
            var /** @type {?} */ lastAssignmentIdx = _this.findLastAssignmentOfKey(key);
            assert(lastAssignmentIdx >= 0, 'Value in context but no assignment record found ' +
                key + ' = ' + value);
            var /** @type {?} */ contextVal = _this._entries[lastAssignmentIdx].val;
            assert(value === contextVal || (isPresent(value) && value === contextVal), 'Value in context  doesnt match value on stack ' + value + ' / ' + contextVal);
        });
        // check entries for proper relationship with any previous records that they override
        for (var /** @type {?} */ i = this._entries.length - 1; i >= 0; i--) {
            var /** @type {?} */ r = this._entries[i];
            var /** @type {?} */ foundFirst = false;
            for (var /** @type {?} */ j = i - 1; j >= 0; j--) {
                var /** @type {?} */ pred = this._entries[j];
                if (pred.srec.key === r.srec.key) {
                    // Predecessors must be masked
                    assert((!foundFirst && pred.maskedByIdx === i) ||
                        ((foundFirst || pred.srec.fromChaining) && pred.maskedByIdx > 0), 'Predecessor A does not have matching maskedByIdx B  for override C:' +
                        pred.srec.key + ' = ' + pred.val + ', ' + pred.maskedByIdx + ', ' +
                        i + ' = ' + r.val);
                    assert(((!foundFirst && r.srec.lastAssignmentIdx === j) || foundFirst ||
                        pred.srec.fromChaining), 'Override A1=A2 does not have proper lastAssignmentIdx B1!=B2 ' +
                        'for predecessor C' +
                        pred.srec.key + ' = ' + pred.val + ', ' + r.srec.lastAssignmentIdx + ' = ' +
                        j + ', ' + pred.val);
                    foundFirst = true;
                }
            }
        }
    };
    /**
     * @param {?} key
     * @param {?} svalue
     * @param {?} value
     * @param {?} merge
     * @param {?} isChaining
     * @return {?}
     */
    Context.prototype._set2 = /**
     * @param {?} key
     * @param {?} svalue
     * @param {?} value
     * @param {?} merge
     * @param {?} isChaining
     * @return {?}
     */
    function (key, svalue, value, merge, isChaining) {
        Context._Debug_SetsCount++;
        // print('Setting key/vale onto stack: ' + key + '=' + value);
        var /** @type {?} */ hasOldValue = this._values.has(key) && isPresent(this._values.get(key));
        var /** @type {?} */ oldVal = hasOldValue ? this._values.get(key) : null;
        var /** @type {?} */ isNewValue = !hasOldValue || this._isNewValue(oldVal, value);
        var /** @type {?} */ matchingPropKeyAssignment = !isNewValue && !isChaining &&
            ((this._meta.keyData(key).isPropertyScope) &&
                key !== this._currentPropertyScopeKey());
        if (isNewValue || matchingPropKeyAssignment) {
            var /** @type {?} */ lastMatch = void 0;
            var /** @type {?} */ newMatch = void 0;
            var /** @type {?} */ salience = this._frameStarts.length;
            var /** @type {?} */ lastAssignmentIdx = -1;
            if (isBlank(oldVal)) {
                lastMatch = this.lastMatchWithoutContextProps();
            }
            else {
                // We recompute that match up to this point by recomputing forward
                // from the point of the last assignment to this key (skipping it), then
                // match against the array of our value and the old
                var /** @type {?} */ recIdx = this._entries.length;
                lastAssignmentIdx = this.findLastAssignmentOfKey(key);
                assert(lastAssignmentIdx >= 0, 'Value in context but no assignment record found ' + key + ' = ' + oldVal);
                if (matchingPropKeyAssignment) {
                    // cheap version of masking for a matching set:
                    this._entries[lastAssignmentIdx].maskedByIdx = recIdx;
                    lastMatch = this.lastMatchWithoutContextProps();
                }
                else {
                    // be able to override a non-chaining assignment.  Our problem is, though, if
                    // the developer wanted to force a re-assignment in the new frame, we'd filter
                    // it out as a duplicate assignment above.  Now, we could allow that assignment
                    // through, but it would then break inletiants when searching back to mask a
                    // key (we wouldn't realize that we need to go further back to find the
                    // original one).
                    var /** @type {?} */ oldRec = this._entries[lastAssignmentIdx];
                    if (oldRec.srec.salience === salience) {
                        var /** @type {?} */ prev = this.findLastAssignmentOfKeyWithValue(key, value);
                        if (prev !== -1 && this._entries[prev].srec.salience === salience) {
                            return false;
                        }
                    }
                    if (isChaining &&
                        (oldRec.srec.salience > salience || !oldRec.srec.fromChaining)) {
                        // print('Set of key skipped (salience %s <= %s)' + key + ', ' + oldVal +
                        // ', ' + value + ', ' + salience + ', ' + oldRec.srec.salience);
                        return false;
                    }
                    var /** @type {?} */ firstAssignmentIdx = this._prepareForOverride(recIdx, lastAssignmentIdx);
                    newMatch = this._rematchForOverride(key, svalue, recIdx, firstAssignmentIdx);
                    if (merge) {
                        value = Meta.PropertyMerger_List.merge(oldVal, value, this.isDeclare());
                    }
                }
            }
            assert(this._entries.length <= Context.MaxContextStackSize, 'MetaUI context stack exceeded max size -- likely infinite chaining: ' +
                this._entries.length);
            var /** @type {?} */ srec = new StaticRec();
            srec.key = key;
            // todo: conversion
            srec.val = svalue;
            srec.lastAssignmentIdx = lastAssignmentIdx;
            srec.salience = salience;
            srec.fromChaining = isChaining;
            if (isBlank(newMatch)) {
                newMatch = (isPresent(value)) ? this._meta.match(key, svalue, lastMatch) : lastMatch;
            }
            srec.match = newMatch;
            srec.activation = this._currentActivation;
            this._currentActivation._recs.push(srec);
            var /** @type {?} */ rec = this.newContextRec();
            rec.srec = srec;
            rec.val = value;
            this._entries.push(rec);
            this._currentProperties = null;
            this._values.set(key, value);
            // console.log( this.debugName + ' => ' +
            //     'Push(' + key + ', ' + svalue + '): ' + 'Matches: ' + newMatch.matches().length
            //     + ', PropMap: ' + srec.properties().size);
            if (Context._DebugRuleMatches) {
                this._checkMatch(srec.match, key, value);
            }
            this.assertContextConsistent();
            return true;
        }
        else {
            // print('Context skipped assignment of matching property value %s = %s (isChaining ==
            // %s, isPropKey == %s)', key, value, isChaining,
            // (this._meta.keyData(key).isPropertyScope));
            if (!isChaining && this.meta.keyData(key).isPropertyScope) ;
        }
        return false;
    };
    Object.defineProperty(Context.prototype, "frameStarts", {
        get: /**
         * @return {?}
         */
        function () {
            return this._frameStarts;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} rec
     * @return {?}
     */
    Context.prototype._undoRecValue = /**
     * @param {?} rec
     * @return {?}
     */
    function (rec) {
        if (rec.srec.lastAssignmentIdx === -1 ||
            this._entries[rec.srec.lastAssignmentIdx].maskedByIdx > 0) {
            this._values.delete(rec.srec.key);
        }
        else {
            this._values.set(rec.srec.key, this._entries[rec.srec.lastAssignmentIdx].val);
        }
    };
    // Undoes and masks assignments invalidated by override of given record
    // Returns stack index for first assignment (i.e. where match recomputation must start)
    /**
     * @param {?} overrideIndex
     * @param {?} lastAssignmentIdx
     * @return {?}
     */
    Context.prototype._prepareForOverride = /**
     * @param {?} overrideIndex
     * @param {?} lastAssignmentIdx
     * @return {?}
     */
    function (overrideIndex, lastAssignmentIdx) {
        // if we're overriding a prop context override of a matching value, back up further
        var /** @type {?} */ lastLastIdx = 0;
        while (((lastLastIdx = this._entries[lastAssignmentIdx].srec.lastAssignmentIdx) !== -1) &&
            (this._entries[lastAssignmentIdx].maskedByIdx <= 0)) {
            // mark it! (we'll pick it up below...)
            this._entries[lastAssignmentIdx].maskedByIdx = -1;
            lastAssignmentIdx = lastLastIdx;
        }
        // undo all conflicting or dervied assignments (and mark them)
        for (var /** @type {?} */ i = this._entries.length - 1; i >= lastAssignmentIdx; i--) {
            var /** @type {?} */ r = this._entries[i];
            // we need to undo (and mask) any record that conflict or are derived
            // NOTE: We are skipping the remove all chained records, because this can result in
            // undoing derived state totally unrelated to this key.  Ideally we'd figure out what
            // depended on what...
            if (r.maskedByIdx <= 0 && (i === lastAssignmentIdx || r.maskedByIdx === -1)) {
                // || r.srec.fromChaining
                // mark and undo it
                r.maskedByIdx = overrideIndex;
                this._undoRecValue(r);
            }
        }
        return lastAssignmentIdx;
    };
    /**
     * @param {?} key
     * @param {?} svalue
     * @param {?} overrideIndex
     * @param {?} firstAssignmentIdx
     * @return {?}
     */
    Context.prototype._rematchForOverride = /**
     * @param {?} key
     * @param {?} svalue
     * @param {?} overrideIndex
     * @param {?} firstAssignmentIdx
     * @return {?}
     */
    function (key, svalue, overrideIndex, firstAssignmentIdx) {
        // start from the top down looking for that last unmasked record
        var /** @type {?} */ lastMatch;
        var /** @type {?} */ i = 0;
        for (; i < firstAssignmentIdx; i++) {
            var /** @type {?} */ rec = this._entries[i];
            if (rec.maskedByIdx !== 0) {
                break;
            }
            lastMatch = rec.srec.match;
        }
        var /** @type {?} */ overridesMatch;
        // Rematch skipping over the last assignment of this property
        // and all assignments from chainging
        for (var /** @type {?} */ end = this._entries.length; i < end; i++) {
            var /** @type {?} */ r = this._entries[i];
            // rematch on any unmasked records
            if (r.maskedByIdx === 0) {
                lastMatch = this._meta.match(r.srec.key, r.srec.val, lastMatch);
            }
            else {
                // accumulate masked ('_o') match
                overridesMatch = this._meta.unionOverrideMatch(r.srec.key, r.srec.val, overridesMatch);
            }
        }
        if (isPresent(svalue) || isBlank(lastMatch)) {
            lastMatch = this._meta.match(key, svalue, lastMatch);
        }
        lastMatch.setOverridesMatch(overridesMatch);
        return lastMatch;
    };
    /**
     * @param {?} rec
     * @param {?} recIdx
     * @return {?}
     */
    Context.prototype._undoOverride = /**
     * @param {?} rec
     * @param {?} recIdx
     * @return {?}
     */
    function (rec, recIdx) {
        var /** @type {?} */ lastAssignmentIdx = rec.srec.lastAssignmentIdx;
        var /** @type {?} */ lastLastIdx;
        // bastick up further if necessary
        while (((lastLastIdx = this._entries[lastAssignmentIdx].srec.lastAssignmentIdx) !== -1) &&
            (this._entries[lastLastIdx].maskedByIdx === recIdx)) {
            lastAssignmentIdx = lastLastIdx;
        }
        for (var /** @type {?} */ i = lastAssignmentIdx, /** @type {?} */ c = this._entries.length; i < c; i++) {
            var /** @type {?} */ r = this._entries[i];
            if (r.maskedByIdx === recIdx) {
                this._values.set(r.srec.key, r.val);
                r.maskedByIdx = 0;
            }
        }
    };
    /**
     * @param {?} match
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Context.prototype._checkMatch = /**
     * @param {?} match
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (match, key, value) {
        match._checkMatch(this._values, this._meta);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Context.prototype.findLastAssignmentOfKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        for (var /** @type {?} */ i = this._entries.length - 1; i >= 0; i--) {
            var /** @type {?} */ rec = this._entries[i];
            if (rec.srec.key === key && rec.maskedByIdx === 0) {
                return i;
            }
        }
        return -1;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Context.prototype.findLastAssignmentOfKeyWithValue = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        for (var /** @type {?} */ i = this._entries.length - 1; i >= 0; i--) {
            var /** @type {?} */ rec = this._entries[i];
            if (rec.srec.key === key && !this._isNewValue(rec.val, value)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Check if we have value mirroring (property to context) to do Dynamic property mirroring will
     * be added to the currentActivation deferredAssignment list
     *
     */
    /**
     * Check if we have value mirroring (property to context) to do Dynamic property mirroring will
     * be added to the currentActivation deferredAssignment list
     *
     * @return {?}
     */
    Context.prototype._checkApplyProperties = /**
     * Check if we have value mirroring (property to context) to do Dynamic property mirroring will
     * be added to the currentActivation deferredAssignment list
     *
     * @return {?}
     */
    function () {
        var /** @type {?} */ didSet = false;
        var /** @type {?} */ numEntries = 0;
        var /** @type {?} */ lastSize = 0;
        var /** @type {?} */ declareKey = this._inDeclare() ? this._values.get(Meta.KeyDeclare) : null;
        while ((numEntries = this._entries.length) > lastSize) {
            lastSize = numEntries;
            var /** @type {?} */ rec = this._entries[numEntries - 1];
            var /** @type {?} */ properties = rec.srec.properties();
            var /** @type {?} */ contextKeys = properties.contextKeysUpdated;
            if (isPresent(contextKeys)) {
                for (var /** @type {?} */ i = 0, /** @type {?} */ c = contextKeys.length; i < c; i++) {
                    var /** @type {?} */ propMgr = contextKeys[i];
                    var /** @type {?} */ key = propMgr._name;
                    if (isPresent(declareKey) && key === declareKey) {
                        continue;
                    }
                    // ToDo: applying resolved value -- need to defer resolution on true dynamic
                    // values Suppress chained assignment if: 1) Our parent will assign this
                    // property (has a deferred activation for it), or 2) There's already a
                    // matching assignment with higher salience
                    var /** @type {?} */ newVal = this.staticallyResolveValue(properties.get(key));
                    var /** @type {?} */ prevProps = void 0;
                    var /** @type {?} */ suppress = (isPresent(prevProps) && prevProps.has(key)
                        && !this._isNewValue(this.staticallyResolveValue(prevProps.get(key)), newVal)) ||
                        (this._currentActivation._parent.hasDeferredAssignmentForKey(key));
                    if (!suppress) {
                        var /** @type {?} */ mirrorKey = propMgr._keyDataToSet._key;
                        if (newVal instanceof DynamicPropertyValue) {
                            // print('(deferred) chaining key: ' , propMgr._keyDataToSet._key);
                            this._currentActivation.addDeferredAssignment(mirrorKey, newVal);
                        }
                        else {
                            // compare this value to the value from the end of the last frame
                            // print('chaining key: ' , propMgr._keyDataToSet._key);
                            if (this._set2(mirrorKey, newVal, newVal, false, true)) {
                                didSet = true;
                            }
                        }
                    }
                }
            }
        }
        return didSet;
    };
    /**
     * @return {?}
     */
    Context.prototype.applyPropertyContextAndChain = /**
     * @return {?}
     */
    function () {
        if (this._checkPropertyContext()) {
            while (this._checkApplyProperties()) {
                /* repeat */
            }
        }
    };
    /**
     * @return {?}
     */
    Context.prototype._currentPropertyScopeKey = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ foundKey;
        var /** @type {?} */ foundActivation;
        for (var /** @type {?} */ i = this._entries.length - 1; i >= 0; i--) {
            var /** @type {?} */ rec = this._entries[i];
            if (isPresent(foundActivation) && rec.srec.activation !== foundActivation) {
                break;
            }
            if (this._meta.keyData(rec.srec.key).isPropertyScope) {
                if (!rec.srec.fromChaining) {
                    return rec.srec.key;
                }
                // for chaining assignments, we keep looking until we exhaust the first
                // non-chaining activation Todo: broken -- disabling set of context key from
                // chaining if (foundKey === null) foundKey = scopeKey;
            }
            if (isPresent(foundKey) && !rec.srec.fromChaining) {
                foundActivation = rec.srec.activation;
            }
        }
        return foundKey;
    };
    // Apply a 'property context' property (e.g. field_p for field) to the context if necessary
    /**
     * @return {?}
     */
    Context.prototype._checkPropertyContext = /**
     * @return {?}
     */
    function () {
        assert(this._values instanceof NestedMap, 'Property assignment on base map?');
        var /** @type {?} */ scopeKey = this._currentPropertyScopeKey();
        if (isPresent(scopeKey)) {
            return this._set2(Meta.ScopeKey, scopeKey, scopeKey, false, false);
        }
        return false;
    };
    /**
     * @return {?}
     */
    Context.prototype.debug = /**
     * @return {?}
     */
    function () {
        // set debugger breakpoint here
        print('******  Debug Call ******');
        this._logContext();
    };
    /**
     * @return {?}
     */
    Context.prototype.debugString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ buffer = new StringJoiner(['<b>Context:</b>&nbsp;']);
        buffer.add('(&nbsp;');
        buffer.add(this._entries.length + '');
        buffer.add(' entries');
        buffer.add('&nbsp;)<br/>');
        for (var /** @type {?} */ i = 0, /** @type {?} */ c = this._entries.length; i < c; i++) {
            var /** @type {?} */ sp = i;
            while (sp-- > 0) {
                buffer.add('&nbsp;');
            }
            var /** @type {?} */ r = this._entries[i];
            buffer.add('&nbsp;');
            buffer.add(r.srec.key);
            buffer.add('&nbsp;&nbsp;:&nbsp;');
            buffer.add(r.srec.val);
            buffer.add((r.srec.fromChaining ? ' ^' : ''));
            buffer.add((r.maskedByIdx !== 0 ? ' X' : ''));
            buffer.add('<br/>');
        }
        var /** @type {?} */ propertyActivation = this.currentActivation._propertyActivation;
        if (isPresent(propertyActivation)) {
            var /** @type {?} */ srecs = propertyActivation._recs;
            buffer.add('&nbsp;&nbsp;&nbsp;<b>PropertyActivation...</b><br/>');
            for (var /** @type {?} */ i = 0, /** @type {?} */ c = srecs.length; i < c; i++) {
                var /** @type {?} */ sp = i + this._entries.length + 1;
                while (sp-- > 0) {
                    buffer.add('&nbsp;&nbsp;');
                }
                var /** @type {?} */ r = srecs[i];
                buffer.add(r.key);
                buffer.add('&nbsp;&nbsp;:&nbsp;');
                buffer.add(r.val);
                buffer.add((r.fromChaining ? '&nbsp;&nbsp;' : '&nbsp;&nbsp;!'));
                buffer.add('<br/>');
            }
        }
        buffer.add('&nbsp;<br/><b>Props:</b><br/>');
        this.writeProperties(buffer, this.allProperties(), 1, false);
        return buffer.toString();
    };
    /**
     * @return {?}
     */
    Context.prototype._logContext = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ debugString = this.debugString();
        print(debugString);
        print('\n');
    };
    /**
     * @param {?} buf
     * @param {?} properties
     * @param {?} level
     * @param {?} singleLine
     * @return {?}
     */
    Context.prototype.writeProperties = /**
     * @param {?} buf
     * @param {?} properties
     * @param {?} level
     * @param {?} singleLine
     * @return {?}
     */
    function (buf, properties, level, singleLine) {
        MapWrapper.iterable(properties).forEach(function (value, key) {
            if (!singleLine) {
                while (level-- > 0) {
                    buf.add('&nbsp;&nbsp;&nbsp;');
                }
            }
            if (isBlank(value)) {
                buf.add(key);
                buf.add(' :null');
                buf.add(singleLine ? ';&nbsp;&nbsp;' : ';<br/>');
            }
            else {
                buf.add('&nbsp;&nbsp;&nbsp;');
                buf.add(key);
                buf.add(':');
                if (isString(value) || isNumber(value)) {
                    buf.add('&nbsp;&nbsp;');
                    buf.add(value);
                    buf.add('&nbsp;&nbsp;');
                }
                else if (isStringMap(value)) {
                    buf.add('{');
                    buf.add(value);
                    buf.add('}');
                }
                else if (value instanceof Expr) {
                    buf.add(value.toString());
                }
                else if (value instanceof Map) {
                    buf.add(MapWrapper.toString(value));
                }
                else if (isArray(value)) {
                    ListWrapper.toString(value);
                }
                else if (value instanceof OverrideValue) {
                    buf.add(value.toString());
                }
                else if (value instanceof FieldPath) {
                    buf.add('$');
                    buf.add(value.toString());
                }
                if (singleLine) {
                    buf.add(';');
                }
                else {
                    buf.add('<br/>');
                }
            }
        });
    };
    /**
     * @return {?}
     */
    Context.prototype.lastMatchWithoutContextProps = /**
     * @return {?}
     */
    function () {
        return ListWrapper.isEmpty(this._entries) ? null : this._entries[this._entries.length - 1].srec.match;
    };
    /**
     * @return {?}
     */
    Context.prototype.lastMatch = /**
     * @return {?}
     */
    function () {
        if (ListWrapper.isEmpty(this._entries)) {
            return null;
        }
        var /** @type {?} */ match = ListWrapper.last(this._entries)
            .propertyLocalMatches(this);
        return (isPresent(match)) ? match : this.lastMatchWithoutContextProps();
    };
    /**
     * @return {?}
     */
    Context.prototype.lastStaticRec = /**
     * @return {?}
     */
    function () {
        if (ListWrapper.isEmpty(this._entries)) {
            return null;
        }
        var /** @type {?} */ rec = ListWrapper.last(this._entries).propertyLocalStaticRec(this);
        return isPresent(rec) ? rec : ListWrapper.last(this._entries).srec;
    };
    Object.defineProperty(Context.prototype, "recPool", {
        get: /**
         * @return {?}
         */
        function () {
            return this._recPool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "currentActivation", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentActivation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Context.prototype.extendedFields = /**
     * @return {?}
     */
    function () {
        return this.values;
    };
    Context._CacheActivations = false;
    Context._ExpensiveContextConsistencyChecksEnabled = false;
    Context._DebugRuleMatches = false;
    Context._Debug_SetsCount = 0;
    Context.MaxContextStackSize = 200;
    Context.EmptyMap = null;
    Context.EmptyRemoveMap = new Map();
    return Context;
}(Extensible));
/**
 * A sharable/re-applicable block of setScopeKeyAssignment _StaticRecs.  An Activation contains
 * the list of assignment records resulting from (chaining from) a single original
 * assignment (as well as _DeferredAssignment records for dynamic values that cannot
 * be statically resolved to records).  Activations form a shared/cached tree, based
 * on context assignment paths previously traversed via assignments to some Context.
 * Subsequent traversals of these paths (likely by different Context instances)
 * are greatly optimized: an existing Activation is retrieved and its records appended
 * to the context's _entries stack; all of the traditional computation of rule match lookups,
 * chained assignments and override indexes is bypassed.
 * Activation gives special treatment to the 'propertyActivation', i.e. the activation
 * resulting from the application of the 'scopeKey' to the current context.  Property lookup
 * following and context assignment require application of the scopeKey, but then the scope key
 * must immediately be popped for the next context assignment.  To avoid this constant push/pop
 * on the bottom of the stack, _Activations cache a side activation (the propertyActivation)
 * for the result of applying the scopeKey to the current activation.  This stack (and its
 * properties) are cached on the side, and can be accessed without actually modifying the main
 * context stack.
 */
var  /**
 * A sharable/re-applicable block of setScopeKeyAssignment _StaticRecs.  An Activation contains
 * the list of assignment records resulting from (chaining from) a single original
 * assignment (as well as _DeferredAssignment records for dynamic values that cannot
 * be statically resolved to records).  Activations form a shared/cached tree, based
 * on context assignment paths previously traversed via assignments to some Context.
 * Subsequent traversals of these paths (likely by different Context instances)
 * are greatly optimized: an existing Activation is retrieved and its records appended
 * to the context's _entries stack; all of the traditional computation of rule match lookups,
 * chained assignments and override indexes is bypassed.
 * Activation gives special treatment to the 'propertyActivation', i.e. the activation
 * resulting from the application of the 'scopeKey' to the current context.  Property lookup
 * following and context assignment require application of the scopeKey, but then the scope key
 * must immediately be popped for the next context assignment.  To avoid this constant push/pop
 * on the bottom of the stack, _Activations cache a side activation (the propertyActivation)
 * for the result of applying the scopeKey to the current activation.  This stack (and its
 * properties) are cached on the side, and can be accessed without actually modifying the main
 * context stack.
 */
Activation = /** @class */ (function () {
    function Activation(_parent) {
        this._parent = _parent;
        this._recs = new Array();
        this._origEntryCount = 0;
    }
    /**
     * @param {?} contextKey
     * @param {?} value
     * @param {?} chaining
     * @return {?}
     */
    Activation.prototype.getChildActivation = /**
     * @param {?} contextKey
     * @param {?} value
     * @param {?} chaining
     * @return {?}
     */
    function (contextKey, value, chaining) {
        if (isBlank(value)) {
            value = Meta.NullMarker;
        }
        var /** @type {?} */ byKey = (chaining)
            ? this._valueNodeMapByContextKeyChaining :
            this._valueNodeMapByContextKey;
        if (isBlank(byKey)) {
            return null;
        }
        var /** @type {?} */ byVal = byKey.get(contextKey);
        return (isBlank(byVal)) ? null : byVal.getValue(value);
    };
    /**
     * @param {?} contextKey
     * @param {?} value
     * @param {?} activation
     * @param {?} chaining
     * @return {?}
     */
    Activation.prototype.cacheChildActivation = /**
     * @param {?} contextKey
     * @param {?} value
     * @param {?} activation
     * @param {?} chaining
     * @return {?}
     */
    function (contextKey, value, activation, chaining) {
        if (isBlank(value)) {
            value = Meta.NullMarker;
        }
        var /** @type {?} */ byKey;
        if (chaining) {
            if (isBlank((byKey = this._valueNodeMapByContextKeyChaining))) {
                byKey = this._valueNodeMapByContextKeyChaining
                    = new Map();
            }
        }
        else {
            if (isBlank((byKey = this._valueNodeMapByContextKey))) {
                byKey = this._valueNodeMapByContextKey
                    = new Map();
            }
        }
        var /** @type {?} */ byVal = byKey.get(contextKey);
        if (isBlank(byVal)) {
            byVal = new Dictionary();
            byKey.set(contextKey, byVal);
        }
        byVal.setValue(value, activation);
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Activation.prototype.addDeferredAssignment = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        var /** @type {?} */ newDa;
        if (isBlank(this.deferredAssignments)) {
            this.deferredAssignments = new Array();
        }
        else {
            try {
                for (var _a = __values(this.deferredAssignments), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var da = _b.value;
                    if (da.key === key) {
                        newDa = da;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (isBlank(newDa)) {
            newDa = new DeferredAssignment();
            newDa.key = key;
            this.deferredAssignments.push(newDa);
        }
        newDa.value = value;
        var e_2, _c;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Activation.prototype.hasDeferredAssignmentForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (isPresent(this.deferredAssignments)) {
            try {
                for (var _a = __values(this.deferredAssignments), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var da = _b.value;
                    if (da.key === key) {
                        return true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return false;
        var e_3, _c;
    };
    /**
     * @param {?} context
     * @return {?}
     */
    Activation.prototype.propertyActivation = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        assert(context.currentActivation === this, 'PropertyActivation sought on non top of stack activation');
        if (isBlank(this._propertyActivation)) {
            this._propertyActivation = context._createNewPropertyContextActivation(this);
            if (isBlank(this._propertyActivation)) {
                this._propertyActivation = this;
            } // this as null marker
        }
        return this._propertyActivation !== this ? this._propertyActivation : null;
    };
    /**
     * @return {?}
     */
    Activation.prototype.findExistingPropertyActivation = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ activation = this;
        while (isPresent(activation)) {
            var /** @type {?} */ propertyActivation = activation._propertyActivation;
            if (isPresent(propertyActivation) && propertyActivation !== activation
                && !(isBlank(propertyActivation._recs) || ListWrapper.isEmpty(propertyActivation._recs))) {
                return propertyActivation;
            }
            activation = activation._parent;
        }
        return null;
    };
    // todo: better better to string for hashing
    /**
     * @return {?}
     */
    Activation.prototype.toString = /**
     * @return {?}
     */
    function () {
        return util.makeString(this);
    };
    return Activation;
}());
var DeferredAssignment = /** @class */ (function () {
    function DeferredAssignment() {
    }
    return DeferredAssignment;
}());
var AssignmentSnapshot = /** @class */ (function () {
    function AssignmentSnapshot() {
    }
    return AssignmentSnapshot;
}());
var Assignment = /** @class */ (function () {
    function Assignment() {
        this.maskedByIdx = 0;
        this._didInitPropContext = false;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    Assignment.prototype.propertyLocalMatches = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        if (!this._didInitPropContext) {
            this.initPropContext(context);
        }
        return isPresent(this._propertyLocalSrec) ? this._propertyLocalSrec.match : null;
    };
    /**
     * @param {?} context
     * @return {?}
     */
    Assignment.prototype.propertyLocalStaticRec = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        if (!this._didInitPropContext) {
            this.initPropContext(context);
        }
        return this._propertyLocalSrec;
    };
    /**
     * @param {?} context
     * @return {?}
     */
    Assignment.prototype.propertyLocalValues = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        if (!this._didInitPropContext) {
            this.initPropContext(context);
        }
        return this._propertyLocalValues;
    };
    /**
     * @param {?} context
     * @return {?}
     */
    Assignment.prototype.initPropContext = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        this._didInitPropContext = true;
        assert(!Context._ExpensiveContextConsistencyChecksEnabled || ListWrapper.last(context._entries) === this, 'initing prop context on record not on top of stack');
        // Todo: base it on whether we've tries yet to process them.
        var /** @type {?} */ propActivation = (this.srec.activation.propertyActivation(context));
        if (isPresent(propActivation)) {
            context._applyPropertyActivation(propActivation, this);
        }
    };
    /**
     * @return {?}
     */
    Assignment.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.srec = null;
        this.val = null;
        this.maskedByIdx = 0;
        this._didInitPropContext = false;
        this._propertyLocalSrec = null;
        this._propertyLocalValues = null;
    };
    return Assignment;
}());
/**
 * The 'static' (sharable) part of a context value assignment record.
 * Theses are created by the first _Assignment that needs them
 * and then cached for re-application in their _Activation
 *  (which, in turn, is stored in the global activation tree)
 */
var  /**
 * The 'static' (sharable) part of a context value assignment record.
 * Theses are created by the first _Assignment that needs them
 * and then cached for re-application in their _Activation
 *  (which, in turn, is stored in the global activation tree)
 */
StaticRec = /** @class */ (function () {
    function StaticRec() {
        this.salience = 0;
        this.lastAssignmentIdx = 0;
    }
    /**
     * @return {?}
     */
    StaticRec.prototype.properties = /**
     * @return {?}
     */
    function () {
        return (isPresent(this.match)) ? this.match.properties() : Context.EmptyMap;
    };
    Object.defineProperty(StaticRec.prototype, "key", {
        get: /**
         * @return {?}
         */
        function () {
            return this._key;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._key = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StaticRec.prototype, "val", {
        get: /**
         * @return {?}
         */
        function () {
            return this._val;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._val = value;
        },
        enumerable: true,
        configurable: true
    });
    return StaticRec;
}());
var PropertyAccessor = /** @class */ (function () {
    function PropertyAccessor(context) {
        this.context = context;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    PropertyAccessor.prototype.get = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this.context.propertyForKey(key);
    };
    /**
     * @return {?}
     */
    PropertyAccessor.prototype.toString = /**
     * @return {?}
     */
    function () {
        return MapWrapper.toString(this.context.allProperties());
    };
    return PropertyAccessor;
}());
/**
 * Snapshot is the way how to capture a current state of the context and then replay it back so.
 * for cases when we need to run some rule execution outside of the push/pop cycle
 */
var  /**
 * Snapshot is the way how to capture a current state of the context and then replay it back so.
 * for cases when we need to run some rule execution outside of the push/pop cycle
 */
Snapshot = /** @class */ (function () {
    function Snapshot(_context) {
        this._context = _context;
        this._meta = _context.meta;
        this._origClass = _context.constructor.name;
        this._assignments = _context.activeAssignments();
        this._allAssignments = _context.allAssignments();
        this._isNested = _context.isNested;
    }
    /**
     * @param {?=} shellCopy
     * @return {?}
     */
    Snapshot.prototype.hydrate = /**
     * @param {?=} shellCopy
     * @return {?}
     */
    function (shellCopy) {
        if (shellCopy === void 0) { shellCopy = true; }
        var /** @type {?} */ assignments = (shellCopy) ? this._assignments : this._allAssignments;
        var /** @type {?} */ newContext = this._meta.newContext();
        newContext.push();
        var /** @type {?} */ lastCnxGeneration = 1;
        try {
            for (var assignments_1 = __values(assignments), assignments_1_1 = assignments_1.next(); !assignments_1_1.done; assignments_1_1 = assignments_1.next()) {
                var a = assignments_1_1.value;
                if (lastCnxGeneration < a.salience) {
                    newContext.push();
                }
                newContext.set(a.key, a.value);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (assignments_1_1 && !assignments_1_1.done && (_a = assignments_1.return)) _a.call(assignments_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        newContext.isNested = this._isNested;
        return newContext;
        var e_4, _a;
    };
    return Snapshot;
}());
var ObjectMetaContext = /** @class */ (function (_super) {
    __extends(ObjectMetaContext, _super);
    function ObjectMetaContext(_meta, nested) {
        if (nested === void 0) { nested = false; }
        return _super.call(this, _meta, nested) || this;
    }
    Object.defineProperty(ObjectMetaContext.prototype, "value", {
        get: /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ obj = this.object;
            if (isBlank(obj)) {
                return null;
            }
            var /** @type {?} */ fieldPath = this.fieldPath();
            return isPresent(fieldPath) ? fieldPath.getFieldValue(obj) : this.propertyForKey('value');
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            var /** @type {?} */ fieldPath = this.fieldPath();
            if (isPresent(fieldPath)) {
                assert(isPresent(this.object), 'Call to setValue() with no current object');
                fieldPath.setFieldValue(this.object, val);
            }
            else {
                var /** @type {?} */ value = this.allProperties().get(ObjectMeta.KeyValue);
                assert(isDynamicSettable(value), 'Cant set derived property: ' + value);
                var /** @type {?} */ settable = value;
                ((/** @type {?} */ (value))).evaluateSet(this, val);
                settable.evaluateSet(this, val);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectMetaContext.prototype, "object", {
        get: /**
         * @return {?}
         */
        function () {
            return this.values.get(ObjectMeta.KeyObject);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectMetaContext.prototype, "formatters", {
        get: /**
         * @return {?}
         */
        function () {
            if (isBlank(this._formatters)) {
                this._formatters = new Map();
            }
            return this._formatters;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ObjectMetaContext.prototype.fieldPath = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ propMap = /** @type {?} */ (this.allProperties());
        return propMap.fieldPath;
    };
    /**
     * @return {?}
     */
    ObjectMetaContext.prototype.locale = /**
     * @return {?}
     */
    function () {
        return ObjectMetaContext.DefaultLocale;
    };
    /**
     * @return {?}
     */
    ObjectMetaContext.prototype.timezone = /**
     * @return {?}
     */
    function () {
        return new Date().getTimezoneOffset();
    };
    ObjectMetaContext.DefaultLocale = 'en';
    return ObjectMetaContext;
}(Context));
var UIContext = /** @class */ (function (_super) {
    __extends(UIContext, _super);
    function UIContext(_meta, nested) {
        if (nested === void 0) { nested = false; }
        return _super.call(this, _meta, nested) || this;
    }
    // user values from user settings/locales
    /**
     * @return {?}
     */
    UIContext.prototype.locale = /**
     * @return {?}
     */
    function () {
        return _super.prototype.locale.call(this);
    };
    /**
     * @return {?}
     */
    UIContext.prototype.timezone = /**
     * @return {?}
     */
    function () {
        return _super.prototype.timezone.call(this);
    };
    return UIContext;
}(ObjectMetaContext));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * A Selector defines a sort of key/value predicate that must be satisfied for a
 * rule to apply.
 */
var  /**
 * A Selector defines a sort of key/value predicate that must be satisfied for a
 * rule to apply.
 */
Selector = /** @class */ (function () {
    function Selector(_key, _value, isDecl) {
        if (isDecl === void 0) { isDecl = false; }
        this._key = _key;
        this._value = _value;
        this.isDecl = isDecl;
        this._matchArrayIdx = 0;
    }
    /**
     * @param {?} values
     * @return {?}
     */
    Selector.fromMap = /**
     * @param {?} values
     * @return {?}
     */
    function (values) {
        var /** @type {?} */ result = new Array();
        MapWrapper.iterable(values).forEach(function (value, key) {
            result.push(new Selector(key, value, false));
        });
        return result;
    };
    Object.defineProperty(Selector.prototype, "key", {
        get: /**
         * @return {?}
         */
        function () {
            return this._key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selector.prototype, "value", {
        get: /**
         * @return {?}
         */
        function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} keyData
     * @return {?}
     */
    Selector.prototype.bindToKeyData = /**
     * @param {?} keyData
     * @return {?}
     */
    function (keyData) {
        this._matchArrayIdx = keyData._id;
        this._matchValue = keyData.matchValue(this._value);
    };
    /**
     * @param {?} matchArray
     * @return {?}
     */
    Selector.prototype.matches = /**
     * @param {?} matchArray
     * @return {?}
     */
    function (matchArray) {
        // If we haven't been initialized with a matchValue, then we were indexed and don't need to
        // match
        if (isBlank(this._matchValue)) {
            return true;
        }
        var /** @type {?} */ other = matchArray[this._matchArrayIdx];
        return isPresent(other) ? other.matches(this._matchValue) : false;
    };
    /**
     * @return {?}
     */
    Selector.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner([]);
        sj.add(this.key);
        sj.add('=');
        sj.add(this._value.toString());
        sj.add('(');
        sj.add(this.isDecl + '');
        sj.add(')');
        sj.add('[ ');
        sj.add(this._matchArrayIdx + ']');
        return sj.toString();
    };
    return Selector;
}());
/**
 * A Rule defines a map of properties that should apply in the event that a set of Selectors
 * are matched.  Given a rule base (Meta) and a set of asserted values (Context) a list of matching
 * rules can be computed (by matching their selectors against the values) and by successively (in
 * rank / priority order) applying (merging) their property maps a set of effective properties can
 * be computed.
 *
 */
var  /**
 * A Rule defines a map of properties that should apply in the event that a set of Selectors
 * are matched.  Given a rule base (Meta) and a set of asserted values (Context) a list of matching
 * rules can be computed (by matching their selectors against the values) and by successively (in
 * rank / priority order) applying (merging) their property maps a set of effective properties can
 * be computed.
 *
 */
Rule = /** @class */ (function () {
    function Rule(_selectors, _properties, _rank, _lineNumber) {
        if (_rank === void 0) { _rank = -1; }
        if (_lineNumber === void 0) { _lineNumber = -1; }
        this._selectors = _selectors;
        this._properties = _properties;
        this._rank = _rank;
        this._lineNumber = _lineNumber;
        this.keyMatchesMask = 0;
        this.keyIndexedMask = 0;
        this.keyAntiMask = 0;
    }
    /**
     * @param {?} meta
     * @param {?} src
     * @param {?} dest
     * @param {?} declareKey
     * @return {?}
     */
    Rule.merge = /**
     * @param {?} meta
     * @param {?} src
     * @param {?} dest
     * @param {?} declareKey
     * @return {?}
     */
    function (meta, src, dest, declareKey) {
        var /** @type {?} */ updatedMask = 0;
        MapWrapper.iterable(src).forEach(function (value, key) {
            var /** @type {?} */ propManager = meta.managerForProperty(key);
            var /** @type {?} */ orig = dest.get(key);
            var /** @type {?} */ isDeclare = (isPresent(declareKey) && key === declareKey);
            var /** @type {?} */ newVal = propManager.mergeProperty(key, orig, value, isDeclare);
            if (newVal !== orig) {
                dest.set(key, newVal);
                var /** @type {?} */ keyData = propManager._keyDataToSet;
                if (isPresent(keyData)) {
                    var /** @type {?} */ keymask = shiftLeft(1, keyData._id);
                    if ((keymask & updatedMask) === 0 &&
                        (dest instanceof PropertyMap)) {
                        updatedMask |= keymask;
                        (/** @type {?} */ (dest)).addContextKey(propManager);
                    }
                }
            }
        });
        return updatedMask;
    };
    /**
     * @param {?} matchArray
     * @return {?}
     */
    Rule.prototype.matches = /**
     * @param {?} matchArray
     * @return {?}
     */
    function (matchArray) {
        try {
            for (var _a = __values(this._selectors), _b = _a.next(); !_b.done; _b = _a.next()) {
                var sel = _b.value;
                if (!sel.matches(matchArray)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
        var e_1, _c;
    };
    /**
     * returns context keys modified
     */
    /**
     * returns context keys modified
     * @param {?} meta
     * @param {?} properties
     * @param {?} declareKey
     * @return {?}
     */
    Rule.prototype.apply = /**
     * returns context keys modified
     * @param {?} meta
     * @param {?} properties
     * @param {?} declareKey
     * @return {?}
     */
    function (meta, properties, declareKey) {
        if (this._rank === Number.MIN_VALUE) {
            return 0;
        }
        return Rule.merge(meta, this._properties, properties, declareKey);
    };
    /**
     * @return {?}
     */
    Rule.prototype.disable = /**
     * @return {?}
     */
    function () {
        this._rank = Number.MIN_VALUE;
    };
    /**
     * @return {?}
     */
    Rule.prototype.disabled = /**
     * @return {?}
     */
    function () {
        return this._rank === Number.MIN_VALUE;
    };
    Object.defineProperty(Rule.prototype, "lineNumber", {
        get: /**
         * @return {?}
         */
        function () {
            return this._lineNumber;
        },
        set: /**
         * @param {?} lineNumber
         * @return {?}
         */
        function (lineNumber) {
            this._lineNumber = lineNumber;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Rule.prototype.location = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = isPresent(this._ruleSet) ? this._ruleSet.filePath : 'Unknow';
        return (this._lineNumber >= 0) ? (new StringJoiner([
            path, ':', this._lineNumber + ''
        ])).toString() : path;
    };
    Object.defineProperty(Rule.prototype, "selectors", {
        get: /**
         * @return {?}
         */
        function () {
            return this._selectors;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selectors = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rule.prototype, "properties", {
        get: /**
         * @return {?}
         */
        function () {
            return this._properties;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._properties = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rule.prototype, "rank", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rank;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._rank = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rule.prototype, "ruleSet", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ruleSet;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._ruleSet = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rule.prototype, "id", {
        get: /**
         * @return {?}
         */
        function () {
            return this._id;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Rule.prototype.isEditable = /**
     * @return {?}
     */
    function () {
        return (this._ruleSet !== null) && (this._ruleSet.editableStart > 0) &&
            (this._id >= this._ruleSet.editableStart);
    };
    /**
     * @return {?}
     */
    Rule.prototype.createDecl = /**
     * @return {?}
     */
    function () {
        /*
                 @field=dyno { value:${ some expr} } becomes
                 declare { field:dyno }
                 field=dyno { field:dyno; value:${ some expr} }
                 */
        // add rule for declaration
        var /** @type {?} */ selectors = this._selectors;
        var /** @type {?} */ declPred = selectors[selectors.length - 1];
        var /** @type {?} */ prePreds = this.convertKeyOverrides(selectors.slice(0, selectors.length - 1));
        if (isBlank(this._properties)) {
            this._properties = new Map();
        }
        try {
            for (var selectors_1 = __values(selectors), selectors_1_1 = selectors_1.next(); !selectors_1_1.done; selectors_1_1 = selectors_1.next()) {
                var p = selectors_1_1.value;
                if (!(isArray(p.value))) {
                    this._properties.set(p.key, p.value);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (selectors_1_1 && !selectors_1_1.done && (_a = selectors_1.return)) _a.call(selectors_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Flag the declaring rule as a property
        this._properties.set(Meta.DeclRule, new RuleWrapper(this));
        // check for override scope
        var /** @type {?} */ hasOverrideScope = false;
        try {
            for (var prePreds_1 = __values(prePreds), prePreds_1_1 = prePreds_1.next(); !prePreds_1_1.done; prePreds_1_1 = prePreds_1.next()) {
                var p = prePreds_1_1.value;
                if (p.key === declPred.key) {
                    hasOverrideScope = true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (prePreds_1_1 && !prePreds_1_1.done && (_b = prePreds_1.return)) _b.call(prePreds_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // if decl key isn't scoped, then select on no scope
        if (!hasOverrideScope) {
            var /** @type {?} */ overrideKey = Meta.overrideKeyForKey(declPred.key);
            prePreds.unshift(new Selector(overrideKey, Meta.NullMarker));
        }
        // The decl rule...
        prePreds.push(new Selector(Meta.KeyDeclare, declPred.key));
        var /** @type {?} */ m = new Map();
        m.set(declPred.key, declPred.value);
        return new Rule(prePreds, m, 0, -1);
        var e_2, _a, e_3, _b;
    };
    /**
     *  rewrite any selector of the form "layout=L1, class=c, layout=L2" to
     *  "layout_o=L1 class=c, layout=L2"
     */
    /**
     *  rewrite any selector of the form "layout=L1, class=c, layout=L2" to
     *  "layout_o=L1 class=c, layout=L2"
     * @param {?} orig
     * @return {?}
     */
    Rule.prototype.convertKeyOverrides = /**
     *  rewrite any selector of the form "layout=L1, class=c, layout=L2" to
     *  "layout_o=L1 class=c, layout=L2"
     * @param {?} orig
     * @return {?}
     */
    function (orig) {
        var /** @type {?} */ result = orig;
        var /** @type {?} */ count = orig.length;
        for (var /** @type {?} */ i = 0; i < count; i++) {
            var /** @type {?} */ p = orig[i];
            // See if overridded by same key later in selector
            for (var /** @type {?} */ j = i + 1; j < count; j++) {
                var /** @type {?} */ pNext = orig[j];
                if (pNext.key === p.key) {
                    // if we're overridden, we drop ours, and replace the next collision
                    // with one with our prefix
                    // make a copy if we haven't already
                    if (result === orig) {
                        result = orig.slice(0, i);
                    }
                    p = new Selector(Meta.overrideKeyForKey(p.key), p.value);
                    break;
                }
            }
            if (result !== orig) {
                result.push(p);
            }
        }
        return result;
    };
    /**
     * @return {?}
     */
    Rule.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sj = new StringJoiner(['<Rule [']);
        sj.add(this._rank + '] ');
        if (isBlank(this.selectors)) {
            sj.add('null, null --> null >');
        }
        else {
            sj.add(ListWrapper.toString(this._selectors));
            sj.add(' -> ');
            if (!this._properties) {
                sj.add('[,]' + ' >');
            }
            else {
                if (this._properties.has('declRule')) ;
                sj.add(MapWrapper.toString(this._properties) + ' >');
            }
            sj.add('[ ');
            sj.add(this.keyIndexedMask + ', ');
            sj.add(this.keyAntiMask + ', ');
            sj.add(this.keyMatchesMask + '');
            sj.add(' ]');
        }
        return sj.toString();
    };
    /**
     * @param {?} values
     * @param {?} meta
     * @return {?}
     */
    Rule.prototype._checkRule = /**
     * @param {?} values
     * @param {?} meta
     * @return {?}
     */
    function (values, meta) {
        var _this = this;
        ListWrapper.forEachWithIndex(this.selectors, function (p, i) {
            var /** @type {?} */ contextValue = values.get(p.key);
            var /** @type {?} */ keyData = meta.keyData(p.key);
            if (isPresent(keyData._transformer)) {
                contextValue = keyData._transformer.tranformForMatch(contextValue);
            }
            if (isPresent(contextValue) &&
                ((Meta.KeyAny === p.value && BooleanWrapper.boleanValue(contextValue) ||
                    Meta.objectEquals(contextValue, p.value) ||
                    (isArray(p.value) && p.value.indexOf(contextValue) > -1) ||
                    (isArray(p.value) && contextValue.indexOf(p.value) > -1)))) ;
            else {
                print('Possible bad rule match!  Rule: %s; selector: %s, context val: %s' + _this +
                    ' ' + p + ' ' + contextValue);
            }
        });
    };
    return Rule;
}());
var RuleWrapper = /** @class */ (function () {
    function RuleWrapper(rule) {
        this.rule = rule;
    }
    return RuleWrapper;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Meta is the core class in MetaUI.  An instance of meta represents a 'Rule Base' (a repository
 * rules), and this rule base is used to compute property maps based on a series of key/value
 * constraints (typically based on the current values in a Context instance).
 *
 * Meta works in concert with Match.MatchResult to cache partial matches (match trees) with cached
 * computed property maps. Meta is generally used by way of its subclasses ObjectMeta and UIMeta
 * (which extend Meta with behaviors around auto-creating rules for references Typescripts classes
 * and dynamic properties for field and layout zoning)
 *
 *
 */
var Meta = /** @class */ (function () {
    function Meta() {
        this._rules = new Array();
        this._ruleCount = 0;
        this._testRules = new Map();
        this._nextKeyId = 0;
        this._ruleSetGeneration = 0;
        this._keyData = new Map();
        this._keyDatasById = new Array(Meta.MaxKeyDatas);
        this._MatchToPropsCache = new Dictionary();
        this._PropertyMapUniquer = new Dictionary();
        this._identityCache = new Dictionary();
        this._managerForProperty = new Map();
        this._declareKeyMask = 0;
        Meta.PropertyMerger_DeclareList = new PropertyMergerDeclareList();
        Meta.PropertyMerger_Traits = new PropertyMergerDeclareListForTrait();
        Meta.PropertyMerger_List = new PropertyMerger_List();
        Meta.Transformer_KeyPresent = new KeyValueTransformer_KeyPresent();
        this._declareKeyMask = this.keyData(Meta.KeyDeclare).maskValue();
        this.registerPropertyMerger(Meta.KeyTrait, Meta.PropertyMerger_Traits);
        var /** @type {?} */ nooprule = new Rule(null, null, 0, 0);
        nooprule.disable();
        this._rules[0] = nooprule;
        this._ruleCount = 1;
    }
    /*
     A few handy utilities (for which we probably already have superior versions elsewhere)
     */
    /**
     * @param {?} value
     * @return {?}
     */
    Meta.booleanValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return BooleanWrapper.boleanValue(value);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Meta.toList = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return (isArray(value)) ? value : [value];
    };
    /**
     * @param {?} one
     * @param {?} two
     * @return {?}
     */
    Meta.objectEquals = /**
     * @param {?} one
     * @param {?} two
     * @return {?}
     */
    function (one, two) {
        if (isBlank(one) && isBlank(two)) {
            return true;
        }
        if (isBlank(one) || isBlank(two)) {
            return false;
        }
        return equals(one, two);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Meta.overrideKeyForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return key + '_o';
    };
    /**
     * @param {?} traits
     * @param {?} map
     * @return {?}
     */
    Meta.addTraits = /**
     * @param {?} traits
     * @param {?} map
     * @return {?}
     */
    function (traits, map) {
        var /** @type {?} */ current = map.get(Meta.KeyTrait);
        if (isBlank(current)) {
            map.set(Meta.KeyTrait, traits);
        }
        else {
            ListWrapper.addAll(current, traits);
            map.set(Meta.KeyTrait, current);
        }
    };
    /**
     * @param {?} trait
     * @param {?} map
     * @return {?}
     */
    Meta.addTrait = /**
     * @param {?} trait
     * @param {?} map
     * @return {?}
     */
    function (trait, map) {
        var /** @type {?} */ current = map.get(Meta.KeyTrait);
        if (isBlank(current)) {
            map.set(Meta.KeyTrait, Meta.toList(trait));
        }
        else {
            current.push(trait);
            map.set(Meta.KeyTrait, current);
        }
    };
    /**
     * @param {?} object
     * @return {?}
     */
    Meta.className = /**
     * @param {?} object
     * @return {?}
     */
    function (object) {
        if (isStringMap(object) && (isEntity(object) || isValue(object))) {
            return (/** @type {?} */ (object)).className();
        }
        else if (isStringMap(object)) {
            return objectToName(object);
        }
        else if (isFunction(object)) {
            return object.name;
        }
        return object;
    };
    /**
     * @param {?} loader
     * @return {?}
     */
    Meta.prototype.registerLoader = /**
     * @param {?} loader
     * @return {?}
     */
    function (loader) {
        this._ruleLoader = loader;
    };
    /**
     * @param {?} rule
     * @return {?}
     */
    Meta.prototype.addRule = /**
     * @param {?} rule
     * @return {?}
     */
    function (rule) {
        var /** @type {?} */ selectors = rule.selectors;
        if (selectors.length > 0 && selectors[selectors.length - 1].isDecl) {
            var /** @type {?} */ decl = rule.createDecl();
            this._addRule(decl, true);
        }
        // we allow null to enable creation of a decl, but otherwise this rule has no effect
        if (isPresent(rule.properties)) {
            // After we've captured the decl, do the collapse
            rule._selectors = rule.convertKeyOverrides(rule._selectors);
            this._addRule(rule, true);
        }
    };
    /**
     * @param {?} rule
     * @param {?} pos
     * @return {?}
     */
    Meta.prototype._addToRules = /**
     * @param {?} rule
     * @param {?} pos
     * @return {?}
     */
    function (rule, pos) {
        this._rules[pos] = rule;
    };
    // todo: TEST unit test this
    /**
     * @param {?} rule
     * @param {?} checkPropScope
     * @return {?}
     */
    Meta.prototype._addRule = /**
     * @param {?} rule
     * @param {?} checkPropScope
     * @return {?}
     */
    function (rule, checkPropScope) {
        assert(isPresent(this._currentRuleSet), 'Attempt to add rule without current RuleSet');
        var /** @type {?} */ selectors = rule._selectors;
        var /** @type {?} */ entryId = this._currentRuleSet.allocateNextRuleEntry();
        rule.id = entryId;
        if (rule.rank === 0) {
            rule.rank = this._currentRuleSet._rank++;
        }
        rule.ruleSet = this._currentRuleSet;
        this._addToRules(rule, entryId);
        // index it
        var /** @type {?} */ lastScopeKeyData;
        var /** @type {?} */ declKey;
        var /** @type {?} */ declMask = this.declareKeyMask;
        var /** @type {?} */ matchMask = 0, /** @type {?} */ indexedMask = 0, /** @type {?} */ antiMask = 0;
        var /** @type {?} */ count = selectors.length;
        var /** @type {?} */ indexOnlySelector = Meta._UsePartialIndexing ? this.bestSelectorToIndex(selectors) : null;
        for (var /** @type {?} */ i = count - 1; i >= 0; i--) {
            var /** @type {?} */ p = selectors[i];
            var /** @type {?} */ shouldIndex = (indexOnlySelector === null || p === indexOnlySelector);
            var /** @type {?} */ data = this.keyData(p.key);
            var /** @type {?} */ dataMask = data.maskValue();
            if (!this.isNullMarker(p.value)) {
                if (shouldIndex || Meta._DebugDoubleCheckMatches) {
                    if (isArray(p.value)) {
                        try {
                            for (var _a = __values(p.value), _b = _a.next(); !_b.done; _b = _a.next()) {
                                var v = _b.value;
                                data.addEntry(v, entryId);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else {
                        data.addEntry(p.value, entryId);
                    }
                    if (shouldIndex) {
                        indexedMask |= shiftLeft(1, data.id);
                    }
                }
                if (!shouldIndex) {
                    // prepare selector for direct evaluation
                    p.bindToKeyData(data);
                }
                matchMask |= dataMask;
                if (data.isPropertyScope && isBlank(lastScopeKeyData)) {
                    lastScopeKeyData = data;
                }
                if ((dataMask & declMask) !== 0) {
                    declKey = p.value;
                }
            }
            else {
                antiMask |= dataMask;
            }
        }
        var /** @type {?} */ isDecl = isPresent(declKey);
        var /** @type {?} */ nonScopeKeyDecl = isPresent(declKey) && !this.keyData(declKey).isPropertyScope;
        if (!isDecl || nonScopeKeyDecl) {
            // all non-decl rules don't apply outside decl context
            if (!isDecl) {
                antiMask |= declMask;
            }
            if (isPresent(lastScopeKeyData) && checkPropScope) {
                var /** @type {?} */ traitVal = rule.properties.get(Meta.KeyTrait);
                if (isPresent(traitVal)) {
                    var /** @type {?} */ traitKey = lastScopeKeyData._key + '_trait';
                    var /** @type {?} */ properties = MapWrapper.createEmpty();
                    properties.set(traitKey, traitVal);
                    var /** @type {?} */ traitRule = new Rule(rule._selectors, properties, rule.rank, rule.lineNumber);
                    this._addRule(traitRule, false);
                }
                rule._selectors = selectors.slice(0);
                var /** @type {?} */ scopeSel = new Selector(Meta.ScopeKey, lastScopeKeyData.key);
                rule.selectors.push(scopeSel);
                var /** @type {?} */ data = this.keyData(Meta.ScopeKey);
                if (!Meta._UsePartialIndexing || Meta._DebugDoubleCheckMatches) {
                    data.addEntry(lastScopeKeyData._key, entryId);
                    indexedMask |= shiftLeft(1, data._id);
                }
                scopeSel.bindToKeyData(data);
                matchMask |= shiftLeft(1, data._id);
            }
        }
        rule.keyMatchesMask = matchMask;
        rule.keyIndexedMask = indexedMask;
        rule.keyAntiMask = antiMask;
        var e_1, _c;
    };
    /**
     * @param {?} selectors
     * @return {?}
     */
    Meta.prototype.bestSelectorToIndex = /**
     * @param {?} selectors
     * @return {?}
     */
    function (selectors) {
        var /** @type {?} */ best;
        var /** @type {?} */ bestRank = Number.MIN_VALUE;
        var /** @type {?} */ pos = 0;
        try {
            for (var selectors_1 = __values(selectors), selectors_1_1 = selectors_1.next(); !selectors_1_1.done; selectors_1_1 = selectors_1.next()) {
                var sel = selectors_1_1.value;
                var /** @type {?} */ rank = this.selectivityRank(sel) + pos++;
                if (rank > bestRank) {
                    best = sel;
                    bestRank = rank;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (selectors_1_1 && !selectors_1_1.done && (_a = selectors_1.return)) _a.call(selectors_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return best;
        var e_2, _a;
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    Meta.prototype.selectivityRank = /**
     * @param {?} selector
     * @return {?}
     */
    function (selector) {
        // Score selectors: good if property scope, key !== '*' or bool
        // '*' is particularly bad, since these are inherited by all others
        var /** @type {?} */ score = 1;
        var /** @type {?} */ value = selector.value;
        if (isPresent(value) && !(Meta.KeyAny === value)) {
            score += (isBoolean(value) ? 1 : 9);
        }
        var /** @type {?} */ keyData = this.keyData(selector.key);
        if (keyData.isPropertyScope) {
            score *= 5;
        }
        // Todo: we could score based on # of entries in KeyData
        return score;
    };
    /**
     * if addition of this rule results in addition of extra rules, those are returned
     * (null otherwise)
     */
    /**
     * if addition of this rule results in addition of extra rules, those are returned
     * (null otherwise)
     * @return {?}
     */
    Meta.prototype._editingRuleEnd = /**
     * if addition of this rule results in addition of extra rules, those are returned
     * (null otherwise)
     * @return {?}
     */
    function () {
        return Math.max(this._currentRuleSet.end, this._ruleCount);
    };
    /**
     * @param {?} rule
     * @return {?}
     */
    Meta.prototype._addRuleAndReturnExtras = /**
     * @param {?} rule
     * @return {?}
     */
    function (rule) {
        var /** @type {?} */ start = this._editingRuleEnd();
        var /** @type {?} */ extras;
        this.addRule(rule);
        // Return any extra rules created by addition of this one
        for (var /** @type {?} */ i = start, /** @type {?} */ c = this._editingRuleEnd(); i < c; i++) {
            var /** @type {?} */ r = this._rules[i];
            if (r !== rule) {
                if (isBlank(extras)) {
                    extras = new Array();
                }
                extras.push(r);
            }
        }
        return extras;
    };
    // Icky method to replace an exited rule in place
    /**
     * @param {?} rule
     * @param {?} extras
     * @return {?}
     */
    Meta.prototype._updateEditedRule = /**
     * @param {?} rule
     * @param {?} extras
     * @return {?}
     */
    function (rule, extras) {
        // in place replace existing rule with NoOp
        var /** @type {?} */ nooprule = new Rule(null, null, 0, 0);
        nooprule.disable();
        this._rules[rule.id] = nooprule;
        if (isPresent(extras)) {
            try {
                for (var extras_1 = __values(extras), extras_1_1 = extras_1.next(); !extras_1_1.done; extras_1_1 = extras_1.next()) {
                    var r = extras_1_1.value;
                    r.disable();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (extras_1_1 && !extras_1_1.done && (_a = extras_1.return)) _a.call(extras_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        // Since this rule has already been mutated (the first time it was added) we need to
        // reverse the addition of the scopeKey
        var /** @type {?} */ preds = rule.selectors;
        if ((isPresent(preds) && preds.length > 0) && ListWrapper.last(preds).key === Meta.ScopeKey) {
            ListWrapper.removeAt(preds, preds.length);
        }
        // now (re)-add it and invalidate
        extras = this._addRuleAndReturnExtras(rule);
        this.invalidateRules();
        return extras;
        var e_3, _a;
    };
    /**
     * @param {?} preds
     * @return {?}
     */
    Meta.prototype.scopeKeyForSelector = /**
     * @param {?} preds
     * @return {?}
     */
    function (preds) {
        for (var /** @type {?} */ i = preds.length - 1; i >= 0; i--) {
            var /** @type {?} */ pred = preds[i];
            var /** @type {?} */ data = this.keyData(pred.key);
            if (data.isPropertyScope) {
                return pred.key;
            }
        }
        return null;
    };
    /**
     * @param {?} selectorMap
     * @param {?} propertyMap
     * @return {?}
     */
    Meta.prototype.addRuleFromSelectorMap = /**
     * @param {?} selectorMap
     * @param {?} propertyMap
     * @return {?}
     */
    function (selectorMap, propertyMap) {
        this.addRuleFromSelectorMapWithRank(selectorMap, propertyMap, 0);
    };
    /**
     * @param {?} selectorMap
     * @param {?} propertyMap
     * @param {?} rank
     * @return {?}
     */
    Meta.prototype.addRuleFromSelectorMapWithRank = /**
     * @param {?} selectorMap
     * @param {?} propertyMap
     * @param {?} rank
     * @return {?}
     */
    function (selectorMap, propertyMap, rank) {
        var /** @type {?} */ rule = new Rule(Selector.fromMap(selectorMap), propertyMap, 0, -1);
        if (rank !== 0) {
            rule.rank = rank;
        }
        this.addRule(rule);
    };
    /**
     * @param {?} ruleSet
     * @param {?} selectors
     * @return {?}
     */
    Meta.prototype.addRules = /**
     * @param {?} ruleSet
     * @param {?} selectors
     * @return {?}
     */
    function (ruleSet, selectors) {
        // Special keys:  'props, 'rules'.  Everthing else is a selector
        var /** @type {?} */ props;
        var /** @type {?} */ rules;
        MapWrapper.iterable(ruleSet).forEach(function (value, key) {
            if (key === 'props') {
                props = value;
            }
            else if (key === 'rules') {
                rules = value;
            }
            else {
                selectors.push(new Selector(key, value));
            }
        });
        if (isPresent(props)) {
            this.addRule(new Rule(selectors, props, 0));
        }
        if (isPresent(rules)) {
            try {
                for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
                    var r = rules_1_1.value;
                    this.addRules(r, selectors);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        var e_4, _a;
    };
    // this one expect that we already opened the ruleset
    /**
     * @param {?=} ruleText
     * @param {?=} module
     * @param {?=} editable
     * @return {?}
     */
    Meta.prototype._loadRules = /**
     * @param {?=} ruleText
     * @param {?=} module
     * @param {?=} editable
     * @return {?}
     */
    function (ruleText, module, editable) {
        var _this = this;
        if (module === void 0) { module = 'system'; }
        if (editable === void 0) { editable = true; }
        try {
            if (isPresent(this._ruleLoader)) {
                this._ruleLoader.loadRules(this, ruleText, module, function (rule) { return _this.addRule(rule); });
            }
        }
        catch (/** @type {?} */ e) {
            this.endRuleSet().disableRules();
            throw new Error('Error loading rule: ' + e);
        }
    };
    /**
     * @param {?=} ruleText
     * @return {?}
     */
    Meta.prototype.loadRules = /**
     * @param {?=} ruleText
     * @return {?}
     */
    function (ruleText) {
        this._loadRulesWithRuleSet('StringLiteral', ruleText, 0);
        this.endRuleSet();
    };
    /**
     * @param {?} filename
     * @param {?} ruleText
     * @param {?} rank
     * @return {?}
     */
    Meta.prototype._loadRulesWithRuleSet = /**
     * @param {?} filename
     * @param {?} ruleText
     * @param {?} rank
     * @return {?}
     */
    function (filename, ruleText, rank) {
        this.beginRuleSetWithRank(rank, filename);
        try {
            this._loadRules(ruleText);
        }
        catch (/** @type {?} */ e) {
            this.endRuleSet().disableRules();
            throw new Error('Error loading rule: ' + e);
        }
    };
    /**
     * @param {?} source
     * @param {?} userClass
     * @return {?}
     */
    Meta.prototype.loadUserRule = /**
     * @param {?} source
     * @param {?} userClass
     * @return {?}
     */
    function (source, userClass) {
        return unimplemented();
    };
    /**
     * @param {?} propString
     * @param {?} propertyMap
     * @return {?}
     */
    Meta.prototype.parsePropertyAssignment = /**
     * @param {?} propString
     * @param {?} propertyMap
     * @return {?}
     */
    function (propString, propertyMap) {
        // todo: implement this
        return unimplemented();
    };
    /**
     * @return {?}
     */
    Meta.prototype.clearCaches = /**
     * @return {?}
     */
    function () {
        this._MatchToPropsCache = new Dictionary();
        this._PropertyMapUniquer = new Dictionary();
        this._identityCache = new Dictionary();
    };
    /**
     * @param {?} rule
     * @return {?}
     */
    Meta.prototype.isTraitExportRule = /**
     * @param {?} rule
     * @return {?}
     */
    function (rule) {
        if (isBlank(rule.properties) || rule || rule.properties.size === 1) {
            var /** @type {?} */ key = Array.from(rule.properties.keys())[0];
            return StringWrapper.endsWidth(key, '_trait');
        }
        return false;
    };
    /**
     * @param {?} identificator
     * @return {?}
     */
    Meta.prototype.beginRuleSet = /**
     * @param {?} identificator
     * @return {?}
     */
    function (identificator) {
        this.beginRuleSetWithRank(this._ruleCount, identificator);
    };
    /**
     * @param {?} rank
     * @param {?} filePath
     * @return {?}
     */
    Meta.prototype.beginRuleSetWithRank = /**
     * @param {?} rank
     * @param {?} filePath
     * @return {?}
     */
    function (rank, filePath) {
        try {
            assert(isBlank(this._currentRuleSet), 'Can t start new rule set while one in progress');
            this._currentRuleSet = new RuleSet(this);
            this._currentRuleSet._start = this._ruleCount;
            this._currentRuleSet._end = this._ruleCount;
            this._currentRuleSet._rank = rank;
            this._currentRuleSet._filePath = filePath;
        }
        catch (/** @type {?} */ e) {
            throw e;
        }
    };
    /**
     * @param {?} orig
     * @return {?}
     */
    Meta.prototype.beginReplacementRuleSet = /**
     * @param {?} orig
     * @return {?}
     */
    function (orig) {
        var /** @type {?} */ origRank = orig.startRank();
        this.beginRuleSetWithRank(this._ruleCount, orig._filePath);
        this._currentRuleSet._rank = origRank;
    };
    /**
     * @return {?}
     */
    Meta.prototype.endRuleSet = /**
     * @return {?}
     */
    function () {
        assert(isPresent(this._currentRuleSet), 'No rule set progress');
        var /** @type {?} */ result = this._currentRuleSet;
        if (this._ruleCount < result._end) {
            this._ruleCount = result._end;
        }
        this._currentRuleSet = null;
        this._ruleSetGeneration++;
        return result;
    };
    Object.defineProperty(Meta.prototype, "ruleSetGeneration", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ruleSetGeneration;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Meta.prototype.invalidateRules = /**
     * @return {?}
     */
    function () {
        this._ruleSetGeneration++;
        this.clearCaches();
    };
    /**
     * @return {?}
     */
    Meta.prototype.newContext = /**
     * @return {?}
     */
    function () {
        return new Context(this);
    };
    Object.defineProperty(Meta.prototype, "declareKeyMask", {
        get: /**
         * @return {?}
         */
        function () {
            return this._declareKeyMask;
        },
        enumerable: true,
        configurable: true
    });
    // Touch a key/value to force pre-loading/registration of associated rule files
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Meta.prototype.touch = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        var /** @type {?} */ context = this.newContext();
        context.push();
        context.set(key, value);
        context.allProperties();
        context.pop();
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    Meta.prototype.transformValue = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        var /** @type {?} */ keyData = this._keyData.get(key);
        if (isPresent(keyData) && isPresent(keyData._transformer)) {
            value = keyData._transformer.tranformForMatch(value);
        }
        return value;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} intermediateResult
     * @return {?}
     */
    Meta.prototype.match = /**
     * @param {?} key
     * @param {?} value
     * @param {?} intermediateResult
     * @return {?}
     */
    function (key, value, intermediateResult) {
        var /** @type {?} */ keyData = this._keyData.get(key);
        if (isBlank(keyData)) {
            return intermediateResult;
        }
        var /** @type {?} */ keyMask = shiftLeft(1, keyData._id);
        // Does our result already include this key?  Then no need to join again
        // if (intermediateResult !== null && (intermediateResult._keysMatchedMask & keyMask) !==
        // 0) return intermediateResult;
        return new MatchResult(this, keyData, value, intermediateResult);
    };
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} intermediateResult
     * @return {?}
     */
    Meta.prototype.unionOverrideMatch = /**
     * @param {?} key
     * @param {?} value
     * @param {?} intermediateResult
     * @return {?}
     */
    function (key, value, intermediateResult) {
        var /** @type {?} */ keyData = this._keyData.get(Meta.overrideKeyForKey(key));
        if (isBlank(keyData)) {
            return intermediateResult;
        }
        return new UnionMatchResult(this, keyData, value, intermediateResult);
    };
    /**
     * @return {?}
     */
    Meta.prototype.newPropertiesMap = /**
     * @return {?}
     */
    function () {
        return new PropertyMap();
    };
    /**
     * @param {?} matchResult
     * @return {?}
     */
    Meta.prototype.propertiesForMatch = /**
     * @param {?} matchResult
     * @return {?}
     */
    function (matchResult) {
        var /** @type {?} */ properties = this._MatchToPropsCache.getValue(matchResult);
        if (isPresent(properties)) {
            return properties;
        }
        properties = this.newPropertiesMap();
        var /** @type {?} */ arr = matchResult.filteredMatches();
        if (isBlank(arr)) {
            return properties;
        }
        // first entry is count
        var /** @type {?} */ count = arr[0];
        var /** @type {?} */ rules = new Array(count);
        for (var /** @type {?} */ i = 0; i < count; i++) {
            rules[i] = this._rules[arr[i + 1]];
        }
        ListWrapper.sort(rules, function (o1, o2) { return o1.rank - o2.rank; });
        var /** @type {?} */ modifiedMask = 0;
        var /** @type {?} */ declareKey = ((this._declareKeyMask & matchResult.keysMatchedMask) !== 0)
            ? matchResult.valueForKey(Meta.KeyDeclare) : null;
        for (var /** @type {?} */ r in rules) {
            modifiedMask |= rules[r].apply(this, properties, declareKey);
        }
        properties.awakeProperties();
        this._MatchToPropsCache.setValue(matchResult.immutableCopy(), properties);
        return properties;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Meta.prototype.keyData = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ data = this._keyData.get(key);
        if (isBlank(data)) {
            var /** @type {?} */ id = this._nextKeyId;
            if (id >= Meta.MaxKeyDatas - 1) {
                print('Exceeded maximum number of context keys');
            }
            this._nextKeyId++;
            data = new KeyData(key, id);
            this._keyDatasById[id] = data;
            this._keyData.set(key, data);
        }
        return data;
    };
    /**
     * @param {?} mask
     * @return {?}
     */
    Meta.prototype._keysInMask = /**
     * @param {?} mask
     * @return {?}
     */
    function (mask) {
        var /** @type {?} */ matches = [];
        var /** @type {?} */ pos = 0;
        while (mask !== 0) {
            if ((mask & 1) !== 0) {
                matches.push(this._keyDatasById[pos]._key);
            }
            pos++;
            mask = shiftRight(mask, 1);
        }
        return matches;
    };
    /**
     * @param {?} key
     * @param {?} o
     * @return {?}
     */
    Meta.prototype.registerKeyInitObserver = /**
     * @param {?} key
     * @param {?} o
     * @return {?}
     */
    function (key, o) {
        this.keyData(key).addObserver(o);
    };
    /**
     * @param {?} key
     * @param {?} transformer
     * @return {?}
     */
    Meta.prototype.registerValueTransformerForKey = /**
     * @param {?} key
     * @param {?} transformer
     * @return {?}
     */
    function (key, transformer) {
        this.keyData(key)._transformer = transformer;
    };
    Object.defineProperty(Meta.prototype, "identityCache", {
        get: /**
         * @return {?}
         */
        function () {
            return this._identityCache;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Meta.prototype.newMatchArray = /**
     * @return {?}
     */
    function () {
        return [];
    };
    /**
     * @param {?} array
     * @param {?} keyData
     * @param {?} matchValue
     * @return {?}
     */
    Meta.prototype.matchArrayAssign = /**
     * @param {?} array
     * @param {?} keyData
     * @param {?} matchValue
     * @return {?}
     */
    function (array, keyData, matchValue) {
        var /** @type {?} */ idx = keyData._id;
        var /** @type {?} */ curr = array[idx];
        if (isPresent(curr)) {
            matchValue = curr.updateByAdding(matchValue);
        }
        array[idx] = matchValue;
    };
    /**
     * @param {?} propertyName
     * @param {?} origValue
     * @return {?}
     */
    Meta.prototype.propertyWillDoMerge = /**
     * @param {?} propertyName
     * @param {?} origValue
     * @return {?}
     */
    function (propertyName, origValue) {
        var /** @type {?} */ merger = this.mergerForProperty(propertyName);
        return this.isPropertyMergerIsChaining(merger) || (isPresent(origValue) && (origValue instanceof Map));
    };
    /**
     * @param {?} name
     * @return {?}
     */
    Meta.prototype.managerForProperty = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ manager = this._managerForProperty.get(name);
        if (isBlank(manager)) {
            manager = new PropertyManager(name);
            this._managerForProperty.set(name, manager);
        }
        return manager;
    };
    /**
     * @param {?} propertyName
     * @param {?} contextKey
     * @return {?}
     */
    Meta.prototype.mirrorPropertyToContext = /**
     * @param {?} propertyName
     * @param {?} contextKey
     * @return {?}
     */
    function (propertyName, contextKey) {
        var /** @type {?} */ keyData = this.keyData(contextKey);
        var /** @type {?} */ manager = this.managerForProperty(propertyName);
        manager._keyDataToSet = keyData;
    };
    /**
     * @param {?} contextKey
     * @return {?}
     */
    Meta.prototype.defineKeyAsPropertyScope = /**
     * @param {?} contextKey
     * @return {?}
     */
    function (contextKey) {
        var /** @type {?} */ keyData = this.keyData(contextKey);
        keyData.isPropertyScope = true;
        var /** @type {?} */ traitKey = contextKey + '_trait';
        this.mirrorPropertyToContext(traitKey, traitKey);
        this.registerPropertyMerger(traitKey, Meta.PropertyMerger_DeclareList);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    Meta.prototype.isPropertyScopeKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return Meta.ScopeKey === key;
    };
    /**
     * @param {?} propertyName
     * @param {?} merger
     * @return {?}
     */
    Meta.prototype.registerPropertyMerger = /**
     * @param {?} propertyName
     * @param {?} merger
     * @return {?}
     */
    function (propertyName, merger) {
        if (isBlank(merger._meta)) {
            merger._meta = this;
        }
        var /** @type {?} */ manager = this.managerForProperty(propertyName);
        manager._merger = merger;
    };
    /**
     * @param {?} propertyName
     * @return {?}
     */
    Meta.prototype.mergerForProperty = /**
     * @param {?} propertyName
     * @return {?}
     */
    function (propertyName) {
        var /** @type {?} */ manager = this.managerForProperty(propertyName);
        return manager._merger;
    };
    /**
     * @param {?} val
     * @return {?}
     */
    Meta.prototype.isPropertyMergerIsChaining = /**
     * @param {?} val
     * @return {?}
     */
    function (val) {
        return isPresent(val.isPropMergerIsChainingMark) && val.isPropMergerIsChainingMark;
    };
    /**
     * @param {?} trait
     * @return {?}
     */
    Meta.prototype.groupForTrait = /**
     * @param {?} trait
     * @return {?}
     */
    function (trait) {
        return 'default';
    };
    /**
     * @return {?}
     */
    Meta.prototype._logRuleStats = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ total = 0;
        var /** @type {?} */ values = this._keyData.keys();
        var /** @type {?} */ counts = [];
        try {
            for (var _a = __values(Array.from(values)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var id = _b.value;
                var /** @type {?} */ keyData = this._keyData.get(id);
                var /** @type {?} */ valuess = keyData.ruleVecs.values();
                try {
                    for (var valuess_1 = __values(valuess), valuess_1_1 = valuess_1.next(); !valuess_1_1.done; valuess_1_1 = valuess_1.next()) {
                        var vm = valuess_1_1.value;
                        var /** @type {?} */ kvc = new KeyValueCount(keyData._key, (/** @type {?} */ (vm))['_value'], isPresent(vm._arr) ? vm._arr[0] : 0);
                        total += kvc.count;
                        counts.push(kvc);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (valuess_1_1 && !valuess_1_1.done && (_c = valuess_1.return)) _c.call(valuess_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_6) throw e_6.error; }
        }
        ListWrapper.sort(counts, function (o1, o2) { return o2.count - o1.count; });
        var /** @type {?} */ buf = new StringJoiner([]);
        var /** @type {?} */ c = Math.min(10, counts.length);
        buf.add('Total index entries comparisons performed: ' + Match._Debug_ElementProcessCount);
        buf.add('\nTotal index entries: ' + total);
        buf.add('\nTop  keys/values: ' + c);
        for (var /** @type {?} */ i = 0; i < c; i++) {
            var /** @type {?} */ kvc = counts[i];
            buf.add('     ' + kvc.key + '  = ' + kvc.value + ' : ' + kvc.count + ' entries');
            buf.add('\n');
        }
        print(buf.toString());
        var e_6, _d, e_5, _c;
    };
    /**
     * @return {?}
     */
    Meta.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'Meta';
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Meta.prototype.isNullMarker = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return isPresent(value) && value['markernull'];
    };
    /**
     * @param {?} testRuleName
     * @param {?} source
     * @return {?}
     */
    Meta.prototype.addTestUserRule = /**
     * @param {?} testRuleName
     * @param {?} source
     * @return {?}
     */
    function (testRuleName, source) {
        this._testRules.set(testRuleName, source);
    };
    Meta.KeyAny = '*';
    Meta.KeyDeclare = 'declare';
    Meta.KeyTrait = 'trait';
    Meta.LowRulePriority = -100000;
    Meta.SystemRulePriority = -200000;
    Meta.ClassRulePriority = -100000;
    Meta.TemplateRulePriority = 100000;
    Meta.EditorRulePriority = 200000;
    Meta.MaxKeyDatas = 64;
    Meta.NullMarker = { markernull: true };
    Meta.ScopeKey = 'scopeKey';
    Meta.DeclRule = 'declRule';
    /**
     *
     * PartialIndexing indexes each rule by a single (well chosen) key and evaluates other parts of
     * the selector on the index-filtered matches (generally this is a  win since may selectors are
     * not selective, resulting in huge rule vectors)
     *
     */
    Meta._UsePartialIndexing = true;
    Meta._DebugDoubleCheckMatches = false;
    Meta.PropertyMerger_DeclareList = null;
    Meta.PropertyMerger_Traits = null;
    Meta.PropertyMerger_List = null;
    Meta.Transformer_KeyPresent = null;
    return Meta;
}());
var KeyValueCount = /** @class */ (function () {
    function KeyValueCount(key, value, count) {
        this.key = key;
        this.value = value;
        this.count = count;
    }
    return KeyValueCount;
}());
/**
 * Store of policy information for particular properties -- most significantly, how
 * successive values of this property are to be *merged* during rule application.
 * (See Meta.registerPropertyMerger).  E.g. 'visible', 'trait', and 'valid' all have unique
 * merge policies.
 */
var  /**
 * Store of policy information for particular properties -- most significantly, how
 * successive values of this property are to be *merged* during rule application.
 * (See Meta.registerPropertyMerger).  E.g. 'visible', 'trait', and 'valid' all have unique
 * merge policies.
 */
PropertyManager = /** @class */ (function () {
    function PropertyManager(_name) {
        this._name = _name;
    }
    /**
     * @param {?} propertyName
     * @param {?} orig
     * @param {?} newValue
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyManager.prototype.mergeProperty = /**
     * @param {?} propertyName
     * @param {?} orig
     * @param {?} newValue
     * @param {?} isDeclare
     * @return {?}
     */
    function (propertyName, orig, newValue, isDeclare) {
        if (isBlank(orig)) {
            return newValue;
        }
        if (newValue instanceof OverrideValue) {
            return (/** @type {?} */ (newValue)).value();
        }
        if (isBlank(this._merger)) {
            // Perhaps should have a data-type-based merger registry?
            if (orig instanceof Map) {
                if (isPresent(newValue) && newValue instanceof Map) {
                    // merge maps
                    // todo: TEST check outcome of the merge and compare
                    var /** @type {?} */ origClone = MapWrapper.clone(orig);
                    newValue = MapWrapper.mergeMapIntoMapWithObject(origClone, newValue, true);
                }
            }
            return newValue;
        }
        if (!(this._merger instanceof PropertyMergerDynamic) &&
            (orig instanceof DynamicPropertyValue || newValue instanceof DynamicPropertyValue)) {
            return new DeferredOperationChain(this._merger, orig, newValue);
        }
        return this._merger.merge(orig, newValue, isDeclare);
    };
    return PropertyManager;
}());
/**
 * Wrapper for a value that should, in rule application, override any previous value for its
 * property.  This can be used to override default property value merge policy, for instance
 * allowing the 'visible' property to be forced from false to true.
 */
var  /**
 * Wrapper for a value that should, in rule application, override any previous value for its
 * property.  This can be used to override default property value merge policy, for instance
 * allowing the 'visible' property to be forced from false to true.
 */
OverrideValue = /** @class */ (function () {
    function OverrideValue(_value) {
        this._value = _value;
    }
    /**
     * @return {?}
     */
    OverrideValue.prototype.value = /**
     * @return {?}
     */
    function () {
        return this._value === 'null' ? null : this._value;
    };
    /**
     * @return {?}
     */
    OverrideValue.prototype.toString = /**
     * @return {?}
     */
    function () {
        return isPresent(this._value) ? this._value.toString() + '!' : 'null' + '!';
    };
    return OverrideValue;
}());
/**
 * KeyData is the primary structure for representing information about context keys
 * (e.g. 'class', 'layout', 'operation', 'field', ...), including an index of rules
 * that match on particular values of that key (_ValueMatches).
 *
 * Note that every context key has a small integer ID (0-63) and these are uses in
 * (long) masks for certain rule matching operations.
 */
var  /**
 * KeyData is the primary structure for representing information about context keys
 * (e.g. 'class', 'layout', 'operation', 'field', ...), including an index of rules
 * that match on particular values of that key (_ValueMatches).
 *
 * Note that every context key has a small integer ID (0-63) and these are uses in
 * (long) masks for certain rule matching operations.
 */
KeyData = /** @class */ (function () {
    function KeyData(_key, _id) {
        this._key = _key;
        this._id = _id;
        this._isPropertyScope = false;
        this._ruleVecs = new Dictionary();
        this._any = this.get(Meta.KeyAny);
    }
    /**
     * @return {?}
     */
    KeyData.prototype.maskValue = /**
     * @return {?}
     */
    function () {
        return shiftLeft(1, this._id);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    KeyData.prototype.get = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (isBlank(value)) {
            value = Meta.NullMarker;
        }
        else if (isPresent(this._transformer)) {
            value = this._transformer.tranformForMatch(value);
        }
        var /** @type {?} */ matches = this._ruleVecs.getValue(value);
        if (isBlank(matches)) {
            matches = new ValueMatches(value);
            if (isPresent(value) && !BooleanWrapper.isFalse(value)) {
                matches._parent = this._any;
            }
            this._ruleVecs.setValue(value, matches);
        }
        return matches;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    KeyData.prototype.matchValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var _this = this;
        if (isArray(value)) {
            var /** @type {?} */ list = value;
            if (list.length === 1) {
                return this.get(list[0]);
            }
            var /** @type {?} */ multi_1 = new MultiMatchValue();
            ListWrapper.forEachWithIndex(list, function (v, i) {
                multi_1.data.push(_this.get(v));
            });
            return multi_1;
        }
        else {
            return this.get(value);
        }
    };
    /**
     * @param {?} value
     * @param {?} id
     * @return {?}
     */
    KeyData.prototype.addEntry = /**
     * @param {?} value
     * @param {?} id
     * @return {?}
     */
    function (value, id) {
        var /** @type {?} */ matches = this.get(value);
        var /** @type {?} */ before = matches._arr;
        var /** @type {?} */ after = Match.addInt(before, id);
        if (before !== after) {
            matches._arr = after;
        }
    };
    /**
     * @param {?} owner
     * @param {?} value
     * @return {?}
     */
    KeyData.prototype.lookup = /**
     * @param {?} owner
     * @param {?} value
     * @return {?}
     */
    function (owner, value) {
        var _this = this;
        var /** @type {?} */ matches = this.get(value);
        if (!matches._read && isPresent(this._observers)) {
            try {
                if (!matches._read) {
                    // notify
                    if (isPresent(value)) {
                        ListWrapper.forEachWithIndex(this._observers, function (v, i) {
                            v.notify(owner, _this._key, value);
                        });
                    }
                }
                matches._read = true;
            }
            finally {
            }
        }
        // check if parent has changed and need to union in parent data
        matches.checkParent();
        return matches._arr;
    };
    /**
     * @param {?} value
     * @param {?} parentValue
     * @return {?}
     */
    KeyData.prototype.setParent = /**
     * @param {?} value
     * @param {?} parentValue
     * @return {?}
     */
    function (value, parentValue) {
        var /** @type {?} */ parent = this.get(parentValue);
        var /** @type {?} */ child = this.get(value);
        child._parent = parent;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    KeyData.prototype.parent = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ child = this.get(value);
        return child._parent._value;
    };
    /**
     * @param {?} o
     * @return {?}
     */
    KeyData.prototype.addObserver = /**
     * @param {?} o
     * @return {?}
     */
    function (o) {
        if (isBlank(this._observers)) {
            this._observers = new Array();
        }
        this._observers.push(o);
    };
    Object.defineProperty(KeyData.prototype, "isPropertyScope", {
        // If this key defines a scope for properties (e.g. field, class, action)
        // this this returns the name of the selector key for those properties
        // (e.g. field_p, class_p)
        get: /**
         * @return {?}
         */
        function () {
            return this._isPropertyScope;
        },
        set: /**
         * @param {?} yn
         * @return {?}
         */
        function (yn) {
            this._isPropertyScope = yn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyData.prototype, "ruleVecs", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ruleVecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyData.prototype, "key", {
        get: /**
         * @return {?}
         */
        function () {
            return this._key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyData.prototype, "id", {
        get: /**
         * @return {?}
         */
        function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyData.prototype, "observers", {
        get: /**
         * @return {?}
         */
        function () {
            return this._observers;
        },
        enumerable: true,
        configurable: true
    });
    return KeyData;
}());
/**
 * Store of policy information for particular properties -- most significantly, how
 * successive values of this property are to be *merged* during rule application.
 * (See Meta.registerPropertyMerger).  E.g. 'visible', 'trait', and 'valid' all have unique
 * merge policies.
 */
var  /**
 * Store of policy information for particular properties -- most significantly, how
 * successive values of this property are to be *merged* during rule application.
 * (See Meta.registerPropertyMerger).  E.g. 'visible', 'trait', and 'valid' all have unique
 * merge policies.
 */
PropertyMap = /** @class */ (function () {
    function PropertyMap(entries) {
        if (isPresent(entries)) {
            this._map = new Map(entries);
        }
        else {
            this._map = new Map();
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    PropertyMap.prototype.get = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._map.get(key);
    };
    /**
     * @return {?}
     */
    PropertyMap.prototype.keys = /**
     * @return {?}
     */
    function () {
        return this._map.keys();
    };
    /**
     * @return {?}
     */
    PropertyMap.prototype.values = /**
     * @return {?}
     */
    function () {
        return this._map.values();
    };
    /**
     * @return {?}
     */
    PropertyMap.prototype.clear = /**
     * @return {?}
     */
    function () {
        this._map.clear();
    };
    /**
     * @param {?} key
     * @param {?=} value
     * @return {?}
     */
    PropertyMap.prototype.set = /**
     * @param {?} key
     * @param {?=} value
     * @return {?}
     */
    function (key, value) {
        return this._map.set(key, value);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    PropertyMap.prototype.delete = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._map.delete(key);
    };
    /**
     * @param {?} callbackfn
     * @param {?=} thisArg
     * @return {?}
     */
    PropertyMap.prototype.forEach = /**
     * @param {?} callbackfn
     * @param {?=} thisArg
     * @return {?}
     */
    function (callbackfn, thisArg) {
        this._map.forEach(callbackfn);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    PropertyMap.prototype.has = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._map.has(key);
    };
    /**
     * @return {?}
     */
    PropertyMap.prototype[Symbol.iterator] = /**
     * @return {?}
     */
    function () {
        return this._map[Symbol.iterator]();
    };
    /**
     * @return {?}
     */
    PropertyMap.prototype.entries = /**
     * @return {?}
     */
    function () {
        return this._map.entries();
    };
    Object.defineProperty(PropertyMap.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._map.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    PropertyMap.prototype.awakeProperties = /**
     * @return {?}
     */
    function () {
        var _this = this;
        MapWrapper.iterable(this).forEach(function (value, key) {
            if (isPropertyMapAwaking(value)) {
                var /** @type {?} */ newValue = value.awakeForPropertyMap(_this);
                if (newValue !== value) {
                    _this.set(key, newValue);
                }
            }
        });
    };
    /**
     * @param {?} key
     * @return {?}
     */
    PropertyMap.prototype.addContextKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (isBlank(this._contextPropertiesUpdated)) {
            this._contextPropertiesUpdated = new Array();
        }
        this._contextPropertiesUpdated.push(key);
    };
    Object.defineProperty(PropertyMap.prototype, "contextKeysUpdated", {
        get: /**
         * @return {?}
         */
        function () {
            return this._contextPropertiesUpdated;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    PropertyMap.prototype.toString = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // todo: find better way for the string. thsi is also used as key for the dictionary
        // not really efficient
        var /** @type {?} */ sj = new StringJoiner(['PropertyMap:']);
        sj.add(this.size + ',');
        MapWrapper.iterable(this).forEach(function (value, key) {
            if (isPropertyMapAwaking(value)) {
                var /** @type {?} */ newValue = value.awakeForPropertyMap(_this);
                if (newValue !== value) {
                    sj.add(key + ':' + value);
                    sj.add(', ');
                }
            }
        });
        return sj.toString();
    };
    return PropertyMap;
}());
/**
 * @abstract
 */
var  /**
 * @abstract
 */
PropertyMergerDynamic = /** @class */ (function () {
    function PropertyMergerDynamic() {
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMergerDynamic.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        return unimplemented();
    };
    /**
     * @return {?}
     */
    PropertyMergerDynamic.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'PropertyMergerDynamic';
    };
    return PropertyMergerDynamic;
}());
var PropertyMerger_Overwrite = /** @class */ (function () {
    function PropertyMerger_Overwrite() {
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMerger_Overwrite.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        return override;
    };
    /**
     * @return {?}
     */
    PropertyMerger_Overwrite.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'OVERWRITE';
    };
    return PropertyMerger_Overwrite;
}());
/**
 * PropertyMerger for properties the should be unioned as lists
 */
var  /**
 * PropertyMerger for properties the should be unioned as lists
 */
PropertyMerger_List = /** @class */ (function () {
    function PropertyMerger_List() {
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMerger_List.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        if (!(isArray(orig)) && !(isArray(override)) && Meta.objectEquals(orig, override)) {
            return orig;
        }
        var /** @type {?} */ l1 = Meta.toList(orig);
        var /** @type {?} */ l2 = Meta.toList(override);
        var /** @type {?} */ result = ListWrapper.clone(l1);
        ListWrapper.addElementsIfAbsent(result, l2);
        return result;
    };
    return PropertyMerger_List;
}());
/**
 * PropertyMerger for properties the should override normally, but return lists when
 * in declare mode (e.g. 'class', 'field', 'layout', ...)
 */
var  /**
 * PropertyMerger for properties the should override normally, but return lists when
 * in declare mode (e.g. 'class', 'field', 'layout', ...)
 */
PropertyMergerDeclareList = /** @class */ (function (_super) {
    __extends(PropertyMergerDeclareList, _super);
    function PropertyMergerDeclareList() {
        return _super.call(this) || this;
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMergerDeclareList.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        if (!isDeclare) {
            return override;
        }
        if (!(isArray(orig)) && !(isArray(override)) && Meta.objectEquals(orig, override)) {
            return orig;
        }
        var /** @type {?} */ result = [];
        ListWrapper.addElementsIfAbsent(result, Meta.toList(orig));
        ListWrapper.addElementsIfAbsent(result, Meta.toList(override));
        return result;
    };
    /**
     * @return {?}
     */
    PropertyMergerDeclareList.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'PropertyMergerDeclareList';
    };
    return PropertyMergerDeclareList;
}(PropertyMergerDynamic));
/**
 * PropertyMerger for the 'trait' property.  Generally, traits are unioned, except for traits
 * from the same 'traitGroup', which override (i.e. only one trait from each traitGroup should
 * survive).
 */
var  /**
 * PropertyMerger for the 'trait' property.  Generally, traits are unioned, except for traits
 * from the same 'traitGroup', which override (i.e. only one trait from each traitGroup should
 * survive).
 */
PropertyMergerDeclareListForTrait = /** @class */ (function (_super) {
    __extends(PropertyMergerDeclareListForTrait, _super);
    function PropertyMergerDeclareListForTrait() {
        return _super.call(this) || this;
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMergerDeclareListForTrait.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        if (isDeclare) {
            return _super.prototype.merge.call(this, orig, override, isDeclare);
        }
        // if we're override a single element with itself, don't go List...
        if (!isArray(orig) && !isArray(override) && Meta.objectEquals(orig, override)) {
            return orig;
        }
        var /** @type {?} */ origL = Meta.toList(orig);
        var /** @type {?} */ overrideL = Meta.toList(override);
        var /** @type {?} */ result = [];
        try {
            for (var origL_1 = __values(origL), origL_1_1 = origL_1.next(); !origL_1_1.done; origL_1_1 = origL_1.next()) {
                var trait = origL_1_1.value;
                if (trait instanceof OverrideValue) {
                    trait = (/** @type {?} */ (trait)).value();
                }
                var /** @type {?} */ canAdd = true;
                var /** @type {?} */ group = this._meta.groupForTrait(trait);
                if (isPresent(group)) {
                    try {
                        for (var overrideL_1 = __values(overrideL), overrideL_1_1 = overrideL_1.next(); !overrideL_1_1.done; overrideL_1_1 = overrideL_1.next()) {
                            var overrideTrait = overrideL_1_1.value;
                            if (overrideTrait instanceof OverrideValue) {
                                overrideTrait = (/** @type {?} */ (overrideTrait)).value();
                            }
                            if (group === this._meta.groupForTrait(overrideTrait)) {
                                canAdd = false;
                                break;
                            }
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (overrideL_1_1 && !overrideL_1_1.done && (_a = overrideL_1.return)) _a.call(overrideL_1);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                }
                if (canAdd) {
                    result.push(trait);
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (origL_1_1 && !origL_1_1.done && (_b = origL_1.return)) _b.call(origL_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        ListWrapper.addElementsIfAbsent(result, overrideL);
        return result;
        var e_8, _b, e_7, _a;
    };
    /**
     * @return {?}
     */
    PropertyMergerDeclareListForTrait.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'PropertyMergerDeclareListForTrait';
    };
    return PropertyMergerDeclareListForTrait;
}(PropertyMergerDeclareList));
/**
 * PropertyMerger implementing AND semantics -- i.e. false trumps true.
 * (Used, for instance, for the properties 'visible' and 'editable')
 */
var  /**
 * PropertyMerger implementing AND semantics -- i.e. false trumps true.
 * (Used, for instance, for the properties 'visible' and 'editable')
 */
PropertyMerger_And = /** @class */ (function (_super) {
    __extends(PropertyMerger_And, _super);
    function PropertyMerger_And() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isPropMergerIsChainingMark = true;
        return _this;
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMerger_And.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        // null will reset (so that it can be overridden to true subsequently
        if (isBlank(override)) {
            return null;
        }
        // If we can evaluate statically, do it now
        if ((isBoolean(orig) && !(BooleanWrapper.boleanValue(orig))) ||
            (isBoolean(override) && !(BooleanWrapper.boleanValue(override)))) {
            return false;
        }
        // ANDing with true is a noop -- return new value
        if (isBoolean(orig) && BooleanWrapper.boleanValue(orig)) {
            return (override instanceof DynamicPropertyValue) ? override
                : BooleanWrapper.boleanValue(override);
        }
        if (isBoolean(override) && BooleanWrapper.boleanValue(override)) {
            return (orig instanceof DynamicPropertyValue) ? orig : BooleanWrapper.boleanValue(override);
        }
        // if one of our values is dynamic, defer
        if ((orig instanceof DynamicPropertyValue || override instanceof DynamicPropertyValue)) {
            return new DeferredOperationChain(this, orig, override);
        }
        return BooleanWrapper.boleanValue(orig) && BooleanWrapper.boleanValue(override);
    };
    /**
     * @return {?}
     */
    PropertyMerger_And.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'AND';
    };
    return PropertyMerger_And;
}(PropertyMergerDynamic));
var PropertyMerger_Valid = /** @class */ (function () {
    function PropertyMerger_Valid() {
        this.isPropMergerIsChainingMark = true;
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    PropertyMerger_Valid.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        /**
                 *
                 *
                 return (isString(override) || ( isBoolean(override) &&
                 !(BooleanWrapper.boleanValue(override)))) ? override : orig;
                 */
        // if first is error (error message or false, it wins), otherwise second
        return (isString(override) || (isBoolean(override) && BooleanWrapper.isFalse(override)))
            ? override : orig;
    };
    /**
     * @return {?}
     */
    PropertyMerger_Valid.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'VALIDATE';
    };
    return PropertyMerger_Valid;
}());
/**
 * A group of rules originating from a common source.
 * All rules must be added to the rule base as part of a RuleSet.
 */
var  /**
 * A group of rules originating from a common source.
 * All rules must be added to the rule base as part of a RuleSet.
 */
RuleSet = /** @class */ (function () {
    function RuleSet(_meta) {
        this._meta = _meta;
        this._start = 0;
        this._end = 0;
        this._editableStart = -1;
        this._rank = 0;
    }
    /**
     * @return {?}
     */
    RuleSet.prototype.disableRules = /**
     * @return {?}
     */
    function () {
        for (var /** @type {?} */ i = this._start; i < this._end; i++) {
            this._meta._rules[i].disable();
        }
        this._meta.clearCaches();
    };
    Object.defineProperty(RuleSet.prototype, "filePath", {
        get: /**
         * @return {?}
         */
        function () {
            return this._filePath;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} editableOnly
     * @return {?}
     */
    RuleSet.prototype.rules = /**
     * @param {?} editableOnly
     * @return {?}
     */
    function (editableOnly) {
        var /** @type {?} */ result = [];
        var /** @type {?} */ i = (editableOnly) ? (this._editableStart === -1 ? this._end : this._editableStart)
            : this._start;
        for (; i < this._end; i++) {
            var /** @type {?} */ r = this._meta._rules[i];
            if (!r.disabled() && !this._meta.isTraitExportRule(r)) {
                result.push(r);
            }
        }
        return result;
    };
    /**
     * @return {?}
     */
    RuleSet.prototype.startRank = /**
     * @return {?}
     */
    function () {
        return (this._start < this._meta._ruleCount)
            ? this._meta._rules[this._start].rank
            : this._rank - (this._end - this._start);
    };
    /**
     * @return {?}
     */
    RuleSet.prototype.allocateNextRuleEntry = /**
     * @return {?}
     */
    function () {
        return (this._meta._ruleCount > this._end) ? this._meta._ruleCount++ : this._end++;
    };
    Object.defineProperty(RuleSet.prototype, "start", {
        get: /**
         * @return {?}
         */
        function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuleSet.prototype, "end", {
        get: /**
         * @return {?}
         */
        function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuleSet.prototype, "editableStart", {
        get: /**
         * @return {?}
         */
        function () {
            return this._editableStart;
        },
        enumerable: true,
        configurable: true
    });
    return RuleSet;
}());
/**
 *
 * Uniquely represents a particular key/value in the Meta scope, and indexes all rules
 * with (indexed) Selectors matching that key/value.
 * ValueMatches also models *inheritance* by allowing one key/value to have another
 * as its 'parent' and thereby match on any Selector (and rule) that its parent would.
 *
 * For instance, this enables a rule on class=Number to apply to class=Integer and
 * class=BigDecimal, and one on class=* to apply to any.
 *
 * The utility of 'parent' is not limited, of course, to the key 'class': all keys
 * take advantage of the parent '*' to support unqualified matches on that key, and
 * keys like 'operation' define a value hierarchy ( 'inspect' -> {'view', 'search'},
 * 'search' -> {'keywordSearch', 'textSearch'})
 */
var  /**
 *
 * Uniquely represents a particular key/value in the Meta scope, and indexes all rules
 * with (indexed) Selectors matching that key/value.
 * ValueMatches also models *inheritance* by allowing one key/value to have another
 * as its 'parent' and thereby match on any Selector (and rule) that its parent would.
 *
 * For instance, this enables a rule on class=Number to apply to class=Integer and
 * class=BigDecimal, and one on class=* to apply to any.
 *
 * The utility of 'parent' is not limited, of course, to the key 'class': all keys
 * take advantage of the parent '*' to support unqualified matches on that key, and
 * keys like 'operation' define a value hierarchy ( 'inspect' -> {'view', 'search'},
 * 'search' -> {'keywordSearch', 'textSearch'})
 */
ValueMatches = /** @class */ (function () {
    function ValueMatches(value) {
        this._read = false;
        this._parentSize = 0;
        this._value = value;
    }
    /**
     * @return {?}
     */
    ValueMatches.prototype.checkParent = /**
     * @return {?}
     */
    function () {
        // todo: performance: keep a rule set version # and only do this when the rule set has
        // reloaded
        if (isPresent(this._parent)) {
            this._parent.checkParent();
            var /** @type {?} */ parentArr = this._parent._arr;
            if (isPresent(parentArr) && parentArr[0] !== this._parentSize) {
                this._arr = Match.union(this._arr, parentArr);
                this._parentSize = parentArr[0];
            }
        }
    };
    /**
     * @param {?} other
     * @return {?}
     */
    ValueMatches.prototype.matches = /**
     * @param {?} other
     * @return {?}
     */
    function (other) {
        if (!(other instanceof ValueMatches)) {
            return other.matches(this);
        }
        // we recurse up parent chain to do superclass matches
        return (other === this) || (isPresent(this._parent) && this._parent.matches(other));
    };
    /**
     * @param {?} other
     * @return {?}
     */
    ValueMatches.prototype.updateByAdding = /**
     * @param {?} other
     * @return {?}
     */
    function (other) {
        var /** @type {?} */ multi = new MultiMatchValue();
        multi.data.push(this);
        return multi.updateByAdding(other);
    };
    return ValueMatches;
}());
var MultiMatchValue = /** @class */ (function () {
    function MultiMatchValue() {
        this.data = [];
    }
    /**
     * @param {?} other
     * @return {?}
     */
    MultiMatchValue.prototype.matches = /**
     * @param {?} other
     * @return {?}
     */
    function (other) {
        if (other instanceof MultiMatchValue) {
            // list / list comparison: any combo can match
            for (var /** @type {?} */ i = 0; i < this.data.length; i++) {
                if (other.matches(this.data[i])) {
                    return true;
                }
            }
        }
        else {
            // single value against array: one must match
            for (var /** @type {?} */ i = 0; i < this.data.length; i++) {
                if (this.data[i].matches(other)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * @param {?} other
     * @return {?}
     */
    MultiMatchValue.prototype.updateByAdding = /**
     * @param {?} other
     * @return {?}
     */
    function (other) {
        if (other instanceof MultiMatchValue) {
            var /** @type {?} */ matchValue = /** @type {?} */ (other);
            ListWrapper.addAll(this.data, matchValue.data);
        }
        else {
            this.data.push(other);
        }
        return this;
    };
    return MultiMatchValue;
}());
var KeyValueTransformer_KeyPresent = /** @class */ (function () {
    function KeyValueTransformer_KeyPresent() {
    }
    /**
     * @param {?} o
     * @return {?}
     */
    KeyValueTransformer_KeyPresent.prototype.tranformForMatch = /**
     * @param {?} o
     * @return {?}
     */
    function (o) {
        return (isPresent(o) && !(BooleanWrapper.isFalse(o))) ? true : false;
    };
    return KeyValueTransformer_KeyPresent;
}());
/**
 * @param {?} arg
 * @return {?}
 */
function isPropertyMapAwaking(arg) {
    return isPresent(arg) && isPresent(arg.propertyAwaking);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright 2017 SAP Ariba
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Based on original work: MetaUI: Craig Federighi (2008)
 *
 */
var ItemProperties = /** @class */ (function () {
    function ItemProperties(name, properties, hidden) {
        this.name = name;
        this.properties = properties;
        this.hidden = hidden;
    }
    return ItemProperties;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * ObjectMeta is resposible for setting up everything related to class, field, actions
 *
 */
var ObjectMeta = /** @class */ (function (_super) {
    __extends(ObjectMeta, _super);
    // todo: implement new decorators in typescript if we want ot annotate _annotationProcessors
    function ObjectMeta() {
        var _this = _super.call(this) || this;
        _this._traitToGroupGeneration = -1;
        _this.registerKeyInitObserver(ObjectMeta.KeyClass, new IntrospectionMetaProvider());
        _this.registerKeyInitObserver(ObjectMeta.KeyType, new FieldTypeIntrospectionMetaProvider());
        // These keys define scopes for their properties
        // These keys define scopes for their properties
        _this.defineKeyAsPropertyScope(ObjectMeta.KeyField);
        _this.defineKeyAsPropertyScope(ObjectMeta.KeyAction);
        _this.defineKeyAsPropertyScope(ObjectMeta.KeyActionCategory);
        _this.defineKeyAsPropertyScope(ObjectMeta.KeyClass);
        // policies for chaining certain well known properties
        // policies for chaining certain well known properties
        _this.registerPropertyMerger(ObjectMeta.KeyVisible, new PropertyMerger_And());
        _this.registerPropertyMerger(ObjectMeta.KeyEditable, new PropertyMerger_And());
        _this.registerPropertyMerger(ObjectMeta.KeyValid, new OMPropertyMerger_Valid());
        _this.registerPropertyMerger(ObjectMeta.KeyClass, Meta.PropertyMerger_DeclareList);
        _this.registerPropertyMerger(ObjectMeta.KeyField, Meta.PropertyMerger_DeclareList);
        _this.registerPropertyMerger(ObjectMeta.KeyAction, Meta.PropertyMerger_DeclareList);
        _this.registerPropertyMerger(ObjectMeta.KeyActionCategory, Meta.PropertyMerger_DeclareList);
        _this.registerPropertyMerger(ObjectMeta.KeyTraitGroup, Meta.PropertyMerger_DeclareList);
        _this.mirrorPropertyToContext(ObjectMeta.KeyClass, ObjectMeta.KeyClass);
        _this.mirrorPropertyToContext(ObjectMeta.KeyType, ObjectMeta.KeyType);
        _this.mirrorPropertyToContext(ObjectMeta.KeyElementType, ObjectMeta.KeyElementType);
        _this.mirrorPropertyToContext(ObjectMeta.KeyTrait, Meta.KeyTrait);
        _this.mirrorPropertyToContext(ObjectMeta.KeyEditable, ObjectMeta.KeyEditable);
        _this.registerValueTransformerForKey(ObjectMeta.KeyObject, Meta.Transformer_KeyPresent);
        // todo: try to support decorators and how we can put meta data into object @Traits,
        // @Properties, @Action
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    ObjectMeta.validationError = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var /** @type {?} */ error = context.propertyForKey(ObjectMeta.KeyValid);
        if (isBlank(error)) {
            return null;
        }
        if (isBoolean(error)) {
            return BooleanWrapper.boleanValue(error) ? null : 'Invalid entry';
        }
        return error.toString();
    };
    /*
     *  Provide subclass context with conveniences for getting object field values
     */
    /**
     * @return {?}
     */
    ObjectMeta.prototype.newContext = /**
     * @return {?}
     */
    function () {
        return new ObjectMetaContext(this, false);
    };
    // Use a special map subsclass for our Properties
    /**
     * @return {?}
     */
    ObjectMeta.prototype.newPropertiesMap = /**
     * @return {?}
     */
    function () {
        return new ObjectMetaPropertyMap();
    };
    /**
     * @param {?} context
     * @param {?} key
     * @return {?}
     */
    ObjectMeta.prototype.itemNames = /**
     * @param {?} context
     * @param {?} key
     * @return {?}
     */
    function (context, key) {
        context.push();
        context.set(ObjectMeta.KeyDeclare, key);
        var /** @type {?} */ itemsNames = context.listPropertyForKey(key);
        context.pop();
        return itemsNames;
    };
    /**
     * @param {?} context
     * @param {?} key
     * @param {?} filterHidden
     * @return {?}
     */
    ObjectMeta.prototype.itemProperties = /**
     * @param {?} context
     * @param {?} key
     * @param {?} filterHidden
     * @return {?}
     */
    function (context, key, filterHidden) {
        return this.itemPropertiesForNames(context, key, this.itemNames(context, key), filterHidden);
    };
    /**
     * @param {?} context
     * @param {?} key
     * @param {?} itemNames
     * @param {?} filterHidden
     * @return {?}
     */
    ObjectMeta.prototype.itemPropertiesForNames = /**
     * @param {?} context
     * @param {?} key
     * @param {?} itemNames
     * @param {?} filterHidden
     * @return {?}
     */
    function (context, key, itemNames, filterHidden) {
        var /** @type {?} */ result = [];
        try {
            for (var itemNames_1 = __values(itemNames), itemNames_1_1 = itemNames_1.next(); !itemNames_1_1.done; itemNames_1_1 = itemNames_1.next()) {
                var itemName = itemNames_1_1.value;
                context.push();
                context.set(key, itemName);
                var /** @type {?} */ isVisible = context.allProperties().get(ObjectMeta.KeyVisible);
                var /** @type {?} */ visible = context.staticallyResolveValue(isVisible);
                var /** @type {?} */ isHidden = (isBlank(visible)) || BooleanWrapper.isFalse(visible);
                if (!isHidden || !filterHidden) {
                    result.push(new ItemProperties(itemName, context.allProperties(), isHidden));
                }
                context.pop();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (itemNames_1_1 && !itemNames_1_1.done && (_a = itemNames_1.return)) _a.call(itemNames_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
        var e_1, _a;
    };
    /**
     * @param {?} trait
     * @return {?}
     */
    ObjectMeta.prototype.groupForTrait = /**
     * @param {?} trait
     * @return {?}
     */
    function (trait) {
        if (this._traitToGroup == null || this._traitToGroupGeneration < this.ruleSetGeneration) {
            this._traitToGroupGeneration = this.ruleSetGeneration;
            this._traitToGroup = new Map();
            var /** @type {?} */ context = this.newContext();
            try {
                for (var _a = __values(this.itemNames(context, ObjectMeta.KeyTraitGroup)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var group = _b.value;
                    context.push();
                    context.set(ObjectMeta.KeyTraitGroup, group);
                    try {
                        for (var _c = __values(this.itemNames(context, ObjectMeta.KeyTrait)), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var name_1 = _d.value;
                            this._traitToGroup.set(name_1, group);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    context.pop();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return this._traitToGroup.get(trait);
        var e_3, _f, e_2, _e;
    };
    Object.defineProperty(ObjectMeta.prototype, "injector", {
        get: /**
         * @return {?}
         */
        function () {
            return this._injector;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._injector = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectMeta.prototype, "componentRegistry", {
        get: /**
         * @return {?}
         */
        function () {
            return this._componentRegistry;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._componentRegistry = value;
        },
        enumerable: true,
        configurable: true
    });
    ObjectMeta.KeyClass = 'class';
    ObjectMeta.KeyField = 'field';
    ObjectMeta.KeyAction = 'action';
    ObjectMeta.KeyActionCategory = 'actionCategory';
    ObjectMeta.KeyObject = 'object';
    ObjectMeta.KeyValue = 'value';
    ObjectMeta.KeyType = 'type';
    ObjectMeta.KeyElementType = 'elementType';
    ObjectMeta.KeyTraitGroup = 'traitGroup';
    ObjectMeta.KeyVisible = 'visible';
    ObjectMeta.KeyEditable = 'editable';
    ObjectMeta.KeyValid = 'valid';
    ObjectMeta.KeyRank = 'rank';
    ObjectMeta.DefaultActionCategory = 'General';
    ObjectMeta._FieldPathNullMarker = new FieldPath('null');
    return ObjectMeta;
}(Meta));
/**
 * When a class is pushed either directly or indirectly (using deffered rules) we receive a
 * ValueQueriedObserver notification in order to register  types for the object. Trying to achieve
 * at least some kind of introspection we need to implement $proto method inside the object that
 * instantiates all types which we can query.
 *
 * Ideally we want to use decorators when dealing with client side typescript class. but for cases
 * where Rules will be loaded using Rest API along with the object instance its impossible.
 */
var  /**
 * When a class is pushed either directly or indirectly (using deffered rules) we receive a
 * ValueQueriedObserver notification in order to register  types for the object. Trying to achieve
 * at least some kind of introspection we need to implement $proto method inside the object that
 * instantiates all types which we can query.
 *
 * Ideally we want to use decorators when dealing with client side typescript class. but for cases
 * where Rules will be loaded using Rest API along with the object instance its impossible.
 */
IntrospectionMetaProvider = /** @class */ (function () {
    function IntrospectionMetaProvider() {
    }
    /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    IntrospectionMetaProvider.prototype.notify = /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (meta, key, value) {
        this._meta = meta;
        var /** @type {?} */ myObject;
        var /** @type {?} */ componentRegistry = (/** @type {?} */ (this._meta)).componentRegistry;
        assert(isPresent(componentRegistry), 'Component registry is not initialized');
        var /** @type {?} */ clazz = null;
        if (isString(value) && (clazz = componentRegistry.nameToType.get(value))
            && isPresent(clazz)) {
            myObject = new clazz();
        }
        else if (isBlank(clazz)) {
            return;
        }
        assert(Meta.className(myObject) === value, 'Trying to process and register a class that does not exists on Context');
        this.registerRulesForClass(myObject, value);
    };
    /**
     * @param {?} object
     * @param {?} className
     * @return {?}
     */
    IntrospectionMetaProvider.prototype.registerRulesForClass = /**
     * @param {?} object
     * @param {?} className
     * @return {?}
     */
    function (object, className$$1) {
        this._meta.keyData(ObjectMeta.KeyClass).setParent(className$$1, 'Object');
        this._meta.beginRuleSet(className$$1);
        try {
            var /** @type {?} */ selectors = [new Selector(ObjectMeta.KeyClass, className$$1)];
            var /** @type {?} */ propertyMap = this._meta.newPropertiesMap();
            selectors[0].isDecl = true;
            var /** @type {?} */ rule = new Rule(selectors, propertyMap, ObjectMeta.ClassRulePriority);
            this._meta.addRule(rule);
            this.registerRulesForFields(object, className$$1);
        }
        finally {
            this._meta.endRuleSet();
        }
    };
    /**
     * @param {?} object
     * @param {?} className
     * @return {?}
     */
    IntrospectionMetaProvider.prototype.registerRulesForFields = /**
     * @param {?} object
     * @param {?} className
     * @return {?}
     */
    function (object, className$$1) {
        // todo: Can we somehow utilize decorators? Maybe for local typescript defined object, but
        // not objects loaded as json from rest API
        assert(isPresent(object['$proto']), 'Cannot register fields without a $proto method that will expose all the fields');
        var /** @type {?} */ instance = object['$proto']();
        var /** @type {?} */ fieldNames = Object.keys(instance);
        var /** @type {?} */ rank = 0;
        try {
            for (var fieldNames_1 = __values(fieldNames), fieldNames_1_1 = fieldNames_1.next(); !fieldNames_1_1.done; fieldNames_1_1 = fieldNames_1.next()) {
                var name_2 = fieldNames_1_1.value;
                // todo: check=>  can we rely on this ?
                var /** @type {?} */ type = instance[name_2].constructor.name;
                var /** @type {?} */ properties = new Map();
                properties.set(ObjectMeta.KeyField, name_2);
                properties.set(ObjectMeta.KeyType, type);
                properties.set(ObjectMeta.KeyVisible, true);
                if (isArray(instance[name_2])) {
                    assert(instance[name_2].length > 0, ' Cannot register type[array] and its type without properly initialized ' +
                        'prototype');
                    var /** @type {?} */ item = instance[name_2][0];
                    var /** @type {?} */ collectionElementType = item.constructor.name;
                    properties.set(ObjectMeta.KeyElementType, collectionElementType);
                }
                var /** @type {?} */ selectorList = [
                    new Selector(ObjectMeta.KeyClass, className$$1),
                    new Selector(ObjectMeta.KeyField, name_2),
                ];
                selectorList[1].isDecl = true;
                properties.set(ObjectMeta.KeyRank, (rank++ + 1) * 10);
                var /** @type {?} */ rule = new Rule(selectorList, properties, ObjectMeta.ClassRulePriority);
                this._meta.addRule(rule);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (fieldNames_1_1 && !fieldNames_1_1.done && (_a = fieldNames_1.return)) _a.call(fieldNames_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _a;
    };
    return IntrospectionMetaProvider;
}());
/**
 * Registers specials types that we are read during introspections
 */
var  /**
 * Registers specials types that we are read during introspections
 */
FieldTypeIntrospectionMetaProvider = /** @class */ (function () {
    function FieldTypeIntrospectionMetaProvider() {
    }
    /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    FieldTypeIntrospectionMetaProvider.prototype.notify = /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (meta, key, value) {
        // print('FieldTypeIntrospectionMetaProvider notified of first use of field:  ' , value);
    };
    return FieldTypeIntrospectionMetaProvider;
}());
var ObjectMetaPropertyMap = /** @class */ (function (_super) {
    __extends(ObjectMetaPropertyMap, _super);
    function ObjectMetaPropertyMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ObjectMetaPropertyMap.prototype, "fieldPath", {
        get: /**
         * @return {?}
         */
        function () {
            if (isBlank(this._fieldPath)) {
                var /** @type {?} */ value = this.get(ObjectMeta.KeyValue);
                var /** @type {?} */ fieldName = this.get(ObjectMeta.KeyField);
                this._fieldPath = (isPresent(fieldName) && isBlank(value))
                    ? new FieldPath(fieldName)
                    : ObjectMeta._FieldPathNullMarker;
            }
            var /** @type {?} */ isNullPath = this._fieldPath === ObjectMeta._FieldPathNullMarker;
            return isNullPath ? null : this._fieldPath;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @return {?}
     */
    ObjectMetaPropertyMap.prototype.isFieldNullMarker = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return isPresent(value) && value.path === 'null';
    };
    return ObjectMetaPropertyMap;
}(PropertyMap));
var OMPropertyMerger_Valid = /** @class */ (function () {
    function OMPropertyMerger_Valid() {
        this.isPropMergerIsChainingMark = true;
    }
    /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    OMPropertyMerger_Valid.prototype.merge = /**
     * @param {?} orig
     * @param {?} override
     * @param {?} isDeclare
     * @return {?}
     */
    function (orig, override, isDeclare) {
        // if first is error (error message or false, it wins), otherwise second
        return (isString(override) || (isBoolean(override) && BooleanWrapper.isFalse(override))) ? override : orig;
    };
    /**
     * @return {?}
     */
    OMPropertyMerger_Valid.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'VALIDATE';
    };
    return OMPropertyMerger_Valid;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  This is generated file. Do not edit !!
 *
 * \@formatter:off
 *
 */
var /** @type {?} */ SystemRules = {
    oss: [
        {
            '_selectors': [
                {
                    '_key': 'object',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'class': {
                    't': 'Expr',
                    'v': 'Meta.className(object)'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'object',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'declare',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'class': {
                    't': 'Expr',
                    'v': 'Meta.className(object)'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': 'search',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'class': {
                    't': 'Expr',
                    'v': 'values.get("class")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editing': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'operation',
                    '_value': [
                        'view',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'SDW',
                    'v': '!properties.get("hidden")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'editing',
                    '_value': true,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editable': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'editing',
                    '_value': false,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editable': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'fiveZones',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'fiveZoneLayout': true,
                'zones': [
                    'zLeft',
                    'zMiddle',
                    'zRight',
                    'zTop',
                    'zBottom',
                    'zDetail'
                ]
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'oneZone',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'zones': [
                    'zLeft',
                    'zDetail'
                ]
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'tableZones',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'zones': [
                    'zMain',
                    'zLeft',
                    'zRight',
                    'zTop',
                    'zBottom',
                    'zDetail'
                ]
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'create',
                        'edit',
                        'view',
                        'search'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'fiveZones'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'list',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'tableZones'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FormZones',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FormZones',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'fiveZones',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FormZones',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FormZones',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'oneZone',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FormZones',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'StringComponent',
                'bindings': {
                    'value': {
                        't': 'CFP',
                        'v': 'value'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'boolean',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'boolean',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'Checkbox'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'boolean',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Number',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'formatter': {
                        't': 'CFP',
                        'v': 'formatters.integer'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Number',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'InputFieldComponent'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Number',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Number',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'search',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'formatter': {
                        't': 'CFP',
                        'v': 'formatters.blankNull.integer'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Number',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Date',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'DateAndTimeComponent',
                'bindings': {
                    'formatter': 'shortDate',
                    'showTime': false
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Date',
                    '_isDecl': false
                },
                {
                    '_key': 'fiveZoneLayout',
                    '_value': true,
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Date',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Date',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'dateTime',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'formatter': 'dateTime',
                    'showTime': true
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Date',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'java.lang.Enum',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'java.lang.Enum',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'GenericChooserComponent',
                'bindings': {
                    'destinationClass': {
                        't': 'Expr',
                        'v': 'type'
                    },
                    'displayKey': 'name',
                    'formatter': {
                        't': 'CFP',
                        'v': 'formatters.identifier'
                    },
                    'key': {
                        't': 'Expr',
                        'v': 'field'
                    },
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'java.lang.Enum',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'search',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'type': 'Popup'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'java.lang.Enum',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'java.lang.Enum',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'enum',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'GenericChooserComponent',
                'bindings': {
                    'multiselect': true,
                    'destinationClass': {
                        't': 'Expr',
                        'v': 'properties.get("enumClass")'
                    },
                    'displayKey': 'name',
                    'formatter': {
                        't': 'CFP',
                        'v': 'formatters.identifier'
                    },
                    'key': {
                        't': 'Expr',
                        'v': 'field'
                    },
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'search',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ownedToMany',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaDetailTable',
                'after': 'zDetail'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': [
                        'Array',
                        'Set'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '[B',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '[B',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'FileUploadChooser',
                'bindings': {
                    'bytes': {
                        't': 'CFP',
                        'v': 'value'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '[B',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '[B',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': false,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'value': {
                        't': 'Expr',
                        'v': 'value ? ("" + value.length + " bytes") : "(none)"'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': '[B',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'File',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'File',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'FileUploadChooser',
                'bindings': {
                    'file': {
                        't': 'CFP',
                        'v': 'value'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'File',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'File',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': false,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'value': {
                        't': 'Expr',
                        'v': 'value ? value.name : "(none)"'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'File',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'InputFieldComponent'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'after': 'zBottom'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'TextAreaComponent',
                'bindings': {
                    'rows': 10,
                    'cols': 60
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'search',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {
                    'escapeUnsafeHtml': true
                },
                'after': 'zBottom'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'RichTextArea',
                'bindings': {
                    'rows': 10,
                    'cols': 60
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': 'search',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'after': 'zNone'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': 'list',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'editable': false,
                'after': 'zDetail'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {
                    'formatter': {
                        't': 'CFP',
                        'v': 'formatters.hiddenPassword'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'AWPasswordField',
                'bindings': {}
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'search',
                        'list'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'truncated',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'TruncateString',
                'bindings': {
                    'size': 10
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'String',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'imageData',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'contentType': 'image/jpeg'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'imageData',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': false,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'AWImageData',
                'bindings': {
                    'bytes': {
                        't': 'CFP',
                        'v': 'value'
                    },
                    'contentType': {
                        't': 'Expr',
                        'v': 'ContentTypeUtils.contentTypeNamed(properties.get("contentType"))'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'imageData',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'imageData',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'awcontentLayouts': {
                        '_main': '_imgUploadPreview'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'imageData',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Binary',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'type',
                    '_value': 'Money',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'CurrencyComponent',
                'bindings': {
                    'money': {
                        't': 'CFP',
                        'v': 'value'
                    },
                    'currencies': {
                        't': 'Expr',
                        'v': 'properties.get("currencies")'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': '_imgUploadPreview',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'wrapperComponent': 'MetaContext',
                'component': 'AWImageData',
                'wrapperBindings': {
                    'scopeKey': 'field'
                },
                'bindings': {
                    'bytes': {
                        't': 'CFP',
                        'v': 'value'
                    },
                    'style': 'width:100px',
                    'contentType': {
                        't': 'Expr',
                        'v': 'ContentTypeUtils.contentTypeNamed(properties.get("contentType"))'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'derived',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'editable': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'derived',
                    '_isDecl': true
                },
                {
                    '_key': 'editing',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'after': 'zNone'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'derived',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'searchable',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'searchable',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': 'search',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': true,
                'editable': {
                    't': 'OV',
                    'v': 'true'
                },
                'after': {
                    't': 'OV',
                    'v': 'null'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'searchable',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'required',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'required',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'required': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'required',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'object',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'valid': {
                    't': 'Expr',
                    'v': '((value != undefined) && (value != null)) ? true : "Answer required"'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'required',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': [
                        'edit',
                        'create'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'required',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'list',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'list',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'GenericChooserComponent',
                'bindings': {
                    'list': {
                        't': 'Expr',
                        'v': 'properties.get("choices")'
                    },
                    'type': {
                        't': 'Expr',
                        'v': 'properties.get("chooserStyle")'
                    },
                    'key': {
                        't': 'Expr',
                        'v': 'properties.get("field")'
                    },
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'list',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'withHoverDetails',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'withHoverDetails',
                    '_isDecl': true
                },
                {
                    '_key': 'editable',
                    '_value': false,
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'HoverCardComponent',
                'bindings': {
                    'linkTitle': {
                        't': 'CFP',
                        'v': 'value'
                    },
                    'appendContentToBody': false,
                    'ngcontentLayout': 'Content'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'withHoverDetails',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': 'Content',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaObjectDetailComponent',
                'bindings': {
                    'layout': 'Inspect',
                    'object': {
                        't': 'CFP',
                        'v': 'value'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noCreate',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noCreate',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': 'create',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noCreate',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noSearch',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noSearch',
                    '_isDecl': true
                },
                {
                    '_key': 'operation',
                    '_value': 'search',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'noSearch',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Popup',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {
                    'type': 'Dropdown'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'PopupControl',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {
                    'type': 'PopupControl'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Chooser',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {
                    'type': 'Chooser'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'PostOnChange',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'bindings': {}
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'GenericChooserComponent',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'bold',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'tagName': 'b'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'italic',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'tagName': 'i'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'heading1',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'tagName': 'h1'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'heading2',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'tagName': 'h2'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'heading3',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'tagName': 'h3'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': [
                        'StringComponent',
                        'AWHyperlink',
                        'PopupMenuLink'
                    ],
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'longtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'richtext',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'secret',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'FieldType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Popup',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'PopupControl',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Chooser',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'ChooserType',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'bold',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'italic',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'heading1',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'heading2',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'heading3',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'WrapperStyle',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'SDW',
                    'v': '!properties.get("hidden")'
                },
                'enabled': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'pageAction',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'actionResults': {
                    't': 'Expr',
                    'v': 'meta.routingService.routeForPage(properties.get("pageName"))'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'modalComponentPage',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'pageBindings': {
                    'componentName': {
                        't': 'Expr',
                        'v': 'properties.get("componentName")'
                    },
                    'title': {
                        't': 'Expr',
                        'v': 'properties.get("title")'
                    }
                },
                'actionResults': {
                    't': 'Expr',
                    'v': 'meta.compPageWithName("MetaModalPage")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'modalComponentPanel',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'pageBindings': {
                    'clientPanel': true,
                    'componentName': {
                        't': 'Expr',
                        'v': 'properties.get("componentName")'
                    },
                    'title': {
                        't': 'Expr',
                        'v': 'properties.get("title")'
                    }
                },
                'actionResults': {
                    't': 'Expr',
                    'v': 'meta.compPageWithName("MetaModalPage")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'messageResults',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'actionResults': {
                    't': 'Expr',
                    'v': 'var o = (properties.isInstanceAction ? object : ariba.ui.aribaweb.util.AWUtil.classForName(properties.class)), var v = ariba.util.fieldvalue.FieldValue.getFieldValue(o, properties.action), var m = ariba.util.core.Fmt.S(properties.message, v), ariba.ui.widgets.AribaPageContent.setMessage(m, requestContext.session()), null'
                },
                'message': 'Action Performed: %s'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'instance',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'isInstanceAction': true,
                'enabled': {
                    't': 'Expr',
                    'v': 'object != null'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'filterActions',
                    '_value': 'instance',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'Expr',
                    'v': 'properties.get("isInstanceAction") == true'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'filterActions',
                    '_value': 'static',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'Expr',
                    'v': '!properties.get("isInstanceAction")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'zones': [
                    'zMain'
                ]
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionButtons',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'visible': true,
                'bindings': {
                    'defaultStyle': 'primary',
                    'renderAs': 'buttons',
                    'align': 'right'
                },
                'elementClass': 'l-action-buttons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionLinks',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'visible': true,
                'bindings': {
                    'renderAs': 'links',
                    'align': 'right'
                },
                'elementClass': 'l-action-buttons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionMenu',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'visible': true,
                'bindings': {
                    'renderAs': 'menu',
                    'align': 'right'
                },
                'elementClass': 'l-action-buttons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'InstanceActionButtons',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'visible': true,
                'bindings': {
                    'filterActions': 'instance',
                    'renderAs': 'buttons',
                    'align': 'right'
                },
                'elementClass': 'l-action-buttons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'StaticActionButtons',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'visible': true,
                'bindings': {
                    'filterActions': 'static',
                    'renderAs': 'buttons',
                    'align': 'right'
                },
                'elementClass': 'l-action-buttons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Tabs',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaTabs',
                'visible': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Sections',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaSectionsComponent',
                'visible': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Form',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaFormComponent',
                'visible': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Stack',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaElementListComponent',
                'visible': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'OwnZone',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'zonePath': {
                    't': 'Expr',
                    'v': 'layout'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'pad8',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'wrapperComponent': 'GenericContainerComponent',
                'wrapperBindings': {
                    'style': 'padding:8px',
                    'tagName': 'div'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'component',
                    '_value': 'MetaFormComponent',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'labelsOnTop',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout_trait',
                    '_value': 'labelsOnTop',
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'bindings': {
                    'showLabelsAboveControls': true
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Tabs',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Sections',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Form',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'Stack',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'LayoutGrouping',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': [
                        'Inspect',
                        'SearchForm'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'Form',
                'label': {
                    't': 'Expr',
                    'v': 'UIMeta.beautifyClassName(values.class)'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': {},
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': [
                        'Inspect',
                        'SearchForm'
                    ],
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'StringComponent',
                'bindings': {}
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'InspectWithActions',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'Stack'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'InspectWithActions',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': 'Actions',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'trait': 'ActionMenu'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'InspectWithActions',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'InspectWithActions',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': 'Inspect',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'trait': 'Form'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'InspectWithActions',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'ButtonArea',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'StaticActionButtons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'SelectionButtonArea',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'InstanceActionButtons'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'Links',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'trait': 'ActionLinks'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'LabelField',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'LabelField',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'labelField',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'visible': {
                    't': 'OV',
                    'v': 'true'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'LabelField',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': [
                        'Table',
                        'DetailTable'
                    ],
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'MetaTable',
                'bindings': {
                    'enableScrolling': true,
                    'showSelectionColumn': false,
                    'displayGroup': {
                        't': 'CFP',
                        'v': 'displayGroup'
                    },
                    'title': {
                        't': 'Expr',
                        'v': 'properties.get("label")'
                    },
                    'submitOnSelectionChange': true,
                    'singleSelect': true
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'layout',
                    '_value': 'ListItem',
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'StringComponent',
                'bindings': {
                    'value': {
                        't': 'Expr',
                        'v': 'properties.get("objectTitle")'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'object',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'objectTitle': {
                    't': 'Expr',
                    'v': 'FieldPath.getFieldValue(object, meta.displayKeyForClass(values.get("class")))'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'object',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'objectTitle': {
                    't': 'Expr',
                    'v': 'FieldPath.getFieldValue(object, meta.displayKeyForClass(values.get("class")))'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'pageBindings': {
                    't': 'Expr',
                    'v': '(properties.get("homePage") == "MetaHomePageComponent") ? new Map().set("module", values.get("module")) : null'
                },
                'component': 'MetaDashboardLayoutComponent',
                'visible': {
                    't': 'SDW',
                    'v': '!properties.get("hidden")'
                },
                'homePage': 'MetaHomePageComponent'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'layout',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionTOC',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionTOC',
                    '_isDecl': true
                },
                {
                    '_key': 'layout',
                    '_value': 'Actions',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'component': 'MetaActionListComponent',
                'label': 'Actions',
                'after': 'zToc'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'ActionTOC',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'module',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'actionCategory',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'SDW',
                    'v': '!properties.get("hidden")'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'actionCategory',
                    '_value': 'General',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'after': 'zMain',
                'label': {
                    't': 'i18n',
                    'v': {
                        'key': 'a001',
                        'defVal': 'General'
                    }
                }
            },
            '_rank': 0
        }
    ]
};
/* tslint:disable */
/**
 *  @formatter:on
 *
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  This is generated file. Do not edit !!
 *
 * \@formatter:off
 *
 */
var /** @type {?} */ SystemPersistenceRules = {
    oss: [
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'displayKey': 'toString',
                'searchOperation': 'search'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'Searchable',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'textSearchSupported': true,
                'searchOperation': 'keywordSearch'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'keywordSearch',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'useTextIndex': true
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'keywordSearch',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': false
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'keywordSearch',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'keywordSearch',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': 'keywords',
                    '_isDecl': true
                }
            ],
            '_properties': {
                'visible': {
                    't': 'OV',
                    'v': 'true'
                },
                'bindings': {
                    'size': 30
                },
                'trait': 'SearchableProperty',
                'rank': 0,
                'after': 'zTop',
                'type': 'java.lang.String'
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'keywordSearch',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'textSearch',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'textSearch',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'textSearch',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'SearchableProperty',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'visible': {
                    't': 'OV',
                    'v': 'true'
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'textSearch',
                    '_isDecl': false
                },
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'operation',
                    '_value': 'textSearch',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'class',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toOneRelationship',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toOneRelationship',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'GenericChooserComponent',
                'bindings': {
                    'destinationClass': {
                        't': 'Expr',
                        'v': 'elementType'
                    },
                    'multiselect': false,
                    'displayKey': {
                        't': 'Expr',
                        'v': 'meta.displayLabel(type, properties.get("labelField"))'
                    },
                    'type': 'Dropdown',
                    'key': {
                        't': 'Expr',
                        'v': 'field'
                    },
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toOneRelationship',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyChooser',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyChooser',
                    '_isDecl': false
                },
                {
                    '_key': 'editable',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'GenericChooserComponent',
                'bindings': {
                    'destinationClass': {
                        't': 'Expr',
                        'v': 'elementType'
                    },
                    'multiselect': true,
                    'displayKey': {
                        't': 'Expr',
                        'v': 'meta.displayLabel(type, properties.get("labelField"))'
                    },
                    'type': 'Chooser',
                    'key': {
                        't': 'Expr',
                        'v': 'field'
                    },
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyChooser',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyLink',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'component': 'AWHyperlink',
                'bindings': {
                    'omitTags': {
                        't': 'Expr',
                        'v': '!value || (value.size() == 0)'
                    },
                    'awcontent': {
                        't': 'Expr',
                        'v': 'value ? ("" + value.size() + " items") : "(none)"'
                    },
                    'action': {
                        't': 'Expr',
                        'v': 'set("object", value), set("actionCategory", "General"), set("action", "Inspect"), ariba.ui.meta.core.UIMeta.getInstance().fireAction(this, requestContext)'
                    }
                }
            },
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'field',
                    '_value': '*',
                    '_isDecl': false
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'toOneRelationship',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyChooser',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                },
                {
                    '_key': 'trait',
                    '_value': 'toManyLink',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'traitGroup',
                    '_value': 'RelViewers',
                    '_isDecl': true
                }
            ],
            '_rank': 0
        },
        {
            '_selectors': [
                {
                    '_key': 'action',
                    '_value': 'Inspect',
                    '_isDecl': false
                }
            ],
            '_properties': {
                'pageBindings': {
                    'layout': 'Inspect',
                    'clientPanel': true,
                    'operation': 'view',
                    'object': {
                        't': 'Expr',
                        'v': 'object'
                    }
                },
                'visible': true,
                'trait': 'pageAction',
                'pageName': 'MetaContentPageComponent'
            },
            '_rank': 0
        }
    ]
};
/* tslint:disable */
/**
 *  @formatter:on
 *
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * UIMeta is responsible setting layouts and all around this. We can either use this as a singleton
 * or use it as a service using Angular \@Inject()
 * Right now we use still singleton as we need this class as a library for some other projects
 *
 *
 * todo: Convert to Injectable
 */
var UIMeta = /** @class */ (function (_super) {
    __extends(UIMeta, _super);
    function UIMeta() {
        var _this = _super.call(this) || this;
        // if (isPresent(loader)) {
        //     this.registerLoader(loader);
        // }
        try {
            _this.beginRuleSet('UIMeta');
            _this.registerKeyInitObserver(UIMeta.KeyClass, new UserMetaDataProvider());
            // These keys define scopes for their properties
            // defineKeyAsPropertyScope(KeyArea);
            // These keys define scopes for their properties
            // defineKeyAsPropertyScope(KeyArea);
            _this.defineKeyAsPropertyScope(UIMeta.KeyLayout);
            _this.defineKeyAsPropertyScope(UIMeta.KeyModule);
            // Default rule for converting field name to label
            // Default rule for converting field name to label
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyClass);
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyField);
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyLayout);
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyModule);
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyAction);
            _this.registerDefaultLabelGeneratorForKey(UIMeta.KeyActionCategory);
            // policies for chaining certain well known properties
            // policies for chaining certain well known properties
            _this.registerPropertyMerger(UIMeta.KeyArea, Meta.PropertyMerger_DeclareList);
            _this.registerPropertyMerger(UIMeta.KeyLayout, Meta.PropertyMerger_DeclareList);
            _this.registerPropertyMerger(UIMeta.KeyModule, Meta.PropertyMerger_DeclareList);
            _this.mirrorPropertyToContext(UIMeta.KeyEditing, UIMeta.KeyEditing);
            _this.mirrorPropertyToContext(UIMeta.KeyLayout, UIMeta.KeyLayout);
            _this.mirrorPropertyToContext(UIMeta.KeyComponentName, UIMeta.KeyComponentName);
            _this.registerPropertyMerger(UIMeta.KeyEditing, new PropertyMerger_And());
            // this.registerValueTransformerForKey('requestContext', UIMeta.Transformer_KeyPresent);
            // this.registerValueTransformerForKey('displayGroup', UIMeta.Transformer_KeyPresent);
            // define operation hierarchy
            // this.registerValueTransformerForKey('requestContext', UIMeta.Transformer_KeyPresent);
            // this.registerValueTransformerForKey('displayGroup', UIMeta.Transformer_KeyPresent);
            // define operation hierarchy
            _this.keyData(UIMeta.KeyOperation).setParent('view', 'inspect');
            _this.keyData(UIMeta.KeyOperation).setParent('print', 'view');
            _this.keyData(UIMeta.KeyOperation).setParent('edit', 'inspect');
            _this.keyData(UIMeta.KeyOperation).setParent('search', 'inspect');
            _this.keyData(UIMeta.KeyOperation).setParent('keywordSearch', 'search');
            _this.keyData(UIMeta.KeyOperation).setParent('textSearch', 'keywordSearch');
            _this.registerStaticallyResolvable(UIMeta.PropFieldsByZone, new PropFieldsByZoneResolver(), UIMeta.KeyClass);
            _this.registerStaticallyResolvable(UIMeta.PropFieldPropertyList, new PropFieldPropertyListResolver(), UIMeta.KeyClass);
            _this.registerStaticallyResolvable(UIMeta.PropLayoutsByZone, new PropLayoutsByZoneResolver(), UIMeta.KeyLayout);
            // this.registerStaticallyResolvable(UIMeta.PropLayoutsByZone , new
            // PropLayoutsByZoneResolver() , UIMeta.KeyLayout);
            // registerStaticallyResolvable('bindingsDictionary' , dyn , KeyField);
            // registerStaticallyResolvable('bindingsDictionary' , dyn , KeyLayout);
            // registerStaticallyResolvable('bindingsDictionary' , dyn , KeyClass);
            // registerStaticallyResolvable('bindingsDictionary' , dyn , KeyModule);
        }
        finally {
            _this.endRuleSet();
        }
        return _this;
    }
    /**
     * @return {?}
     */
    UIMeta.getInstance = /**
     * @return {?}
     */
    function () {
        return this._instance || (this._instance = new this());
    };
    /**
     * @param {?} fieldName
     * @return {?}
     */
    UIMeta.defaultLabelForIdentifier = /**
     * @param {?} fieldName
     * @return {?}
     */
    function (fieldName) {
        var /** @type {?} */ lastDot = fieldName.lastIndexOf('.');
        if (lastDot !== -1 && lastDot !== fieldName.length - 1) {
            fieldName = fieldName.substring(lastDot + 1);
        }
        return decamelize(fieldName);
    };
    /**
     * @param {?} className
     * @return {?}
     */
    UIMeta.beautifyClassName = /**
     * @param {?} className
     * @return {?}
     */
    function (className$$1) {
        return decamelize(className$$1, ' ');
    };
    /**
     * @param {?} field
     * @return {?}
     */
    UIMeta.beautifyFileName = /**
     * @param {?} field
     * @return {?}
     */
    function (field) {
        return decamelize(field, ' ');
    };
    /**
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.zones = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var /** @type {?} */ zones = context.propertyForKey('zones');
        return (isBlank(zones)) ? Meta.toList(UIMeta.ZoneMain) : zones;
    };
    /**
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.zonePath = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var /** @type {?} */ zonePath;
        if (isPresent(context.values.get(UIMeta.KeyLayout))) {
            context.push();
            context.setScopeKey(UIMeta.KeyLayout);
            zonePath = context.propertyForKey(UIMeta.KeyZonePath);
            context.pop();
        }
        return zonePath;
    };
    /**
     * @param {?=} isNested
     * @return {?}
     */
    UIMeta.prototype.newContext = /**
     * @param {?=} isNested
     * @return {?}
     */
    function (isNested) {
        if (isNested === void 0) { isNested = false; }
        return new UIContext(this, isNested);
    };
    // Load system rules
    /**
     * @param {?=} references
     * @return {?}
     */
    UIMeta.prototype.loadDefaultRuleFiles = /**
     * @param {?=} references
     * @return {?}
     */
    function (references) {
        if (isPresent(SystemRules.oss)) {
            this.beginRuleSetWithRank(Meta.SystemRulePriority, 'system');
            try {
                this._loadRules(SystemRules.oss, 'system', false);
            }
            finally {
                this.endRuleSet();
            }
        }
        if (isPresent(SystemPersistenceRules.oss)) {
            this.beginRuleSetWithRank(Meta.SystemRulePriority + 2000, 'system-persistence');
            try {
                this._loadRules(SystemPersistenceRules.oss, 'system-persistence', false);
            }
            finally {
                this.endRuleSet();
            }
        }
        if (isPresent(references)) {
            this.registerComponents(references);
        }
        return false;
    };
    /**
     * loads application level rules. Application level rules are global rules
     */
    /**
     * loads application level rules. Application level rules are global rules
     * @return {?}
     */
    UIMeta.prototype.loadApplicationRules = /**
     * loads application level rules. Application level rules are global rules
     * @return {?}
     */
    function () {
        var /** @type {?} */ aRules;
        var /** @type {?} */ userReferences;
        var /** @type {?} */ appRuleFiles = ['Application'];
        if (isPresent(this.appConfig)) {
            appRuleFiles = this.appConfig.get(UIMeta.AppConfigRuleFilesParam) || ['Application'];
            userReferences = this.appConfig.get(UIMeta.AppConfigUserRulesParam);
            // make sure we have always Application and make it more additive.
            if (!ListWrapper.contains(appRuleFiles, 'Application')) {
                appRuleFiles.unshift('Application');
            }
        }
        try {
            for (var appRuleFiles_1 = __values(appRuleFiles), appRuleFiles_1_1 = appRuleFiles_1.next(); !appRuleFiles_1_1.done; appRuleFiles_1_1 = appRuleFiles_1.next()) {
                var ruleFile = appRuleFiles_1_1.value;
                var /** @type {?} */ rule = ruleFile + 'Rule';
                if (this._testRules.has(rule)) {
                    // since we are in development mode and test mode is on we can check extra
                    // repository used by tests, we need to check if we are not running unittest
                    // and a class is not defined but unittest
                    if (this._testRules.has(rule) &&
                        isPresent(this._testRules.get(rule).oss)) {
                        aRules = this._testRules.get(rule).oss;
                        if (isPresent(aRules)) {
                            this.beginRuleSetWithRank(Meta.LowRulePriority, ruleFile.toLowerCase());
                            try {
                                this._loadRules(aRules, ruleFile.toLowerCase(), false);
                            }
                            finally {
                                this.endRuleSet();
                            }
                        }
                    }
                }
                else {
                    for (var /** @type {?} */ i in userReferences) {
                        var /** @type {?} */ userRule = userReferences[i];
                        if (isPresent(userRule)) {
                            if (isPresent(userRule[rule]) && isPresent(userRule[rule].oss)) {
                                aRules = userRule[rule].oss;
                            }
                        }
                        if (isPresent(aRules)) {
                            this.beginRuleSetWithRank(Meta.LowRulePriority, ruleFile.toLowerCase());
                            try {
                                this._loadRules(aRules, ruleFile.toLowerCase(), false);
                            }
                            finally {
                                this.endRuleSet();
                            }
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (appRuleFiles_1_1 && !appRuleFiles_1_1.done && (_a = appRuleFiles_1.return)) _a.call(appRuleFiles_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    /**
     * @param {?} source
     * @param {?} userClass
     * @return {?}
     */
    UIMeta.prototype.loadUserRule = /**
     * @param {?} source
     * @param {?} userClass
     * @return {?}
     */
    function (source, userClass) {
        if (isPresent(source)) {
            this.beginRuleSetWithRank(this._ruleCount, 'user:' + userClass);
            try {
                this._loadRules(source, 'user', false);
            }
            finally {
                this.endRuleSet();
            }
        }
        return false;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    UIMeta.prototype.defaultLabelGeneratorForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return new _DefaultLabelGenerator(key);
    };
    /**
     * @param {?} propKey
     * @param {?} dynamicValue
     * @param {?} contextKey
     * @param {?} contextValue
     * @return {?}
     */
    UIMeta.prototype.registerDerivedValue = /**
     * @param {?} propKey
     * @param {?} dynamicValue
     * @param {?} contextKey
     * @param {?} contextValue
     * @return {?}
     */
    function (propKey, dynamicValue, contextKey, contextValue) {
        var /** @type {?} */ m = new Map();
        m.set(propKey, dynamicValue);
        this.addRule(new Rule(Meta.toList(new Selector(contextKey, contextValue)), m, Meta.SystemRulePriority));
    };
    /**
     * @param {?} propKey
     * @param {?} dynamicValue
     * @param {?} contextKey
     * @return {?}
     */
    UIMeta.prototype.registerStaticallyResolvable = /**
     * @param {?} propKey
     * @param {?} dynamicValue
     * @param {?} contextKey
     * @return {?}
     */
    function (propKey, dynamicValue, contextKey) {
        this.registerDerivedValue(propKey, new StaticDynamicWrapper(dynamicValue), contextKey, Meta.KeyAny);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    UIMeta.prototype.registerDefaultLabelGeneratorForKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        this.registerDerivedValue(UIMeta.KeyLabel, new LocalizedLabelString(this), key, UIMeta.KeyAny);
    };
    /**
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.fieldList = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this.itemList(context, UIMeta.KeyField, UIMeta.ZonesTLRMB);
    };
    /**
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.fieldsByZones = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this.itemsByZones(context, UIMeta.KeyField, UIMeta.ZonesTLRMB);
    };
    /**
     * @param {?} context
     * @param {?} key
     * @param {?} zones
     * @return {?}
     */
    UIMeta.prototype.itemNamesByZones = /**
     * @param {?} context
     * @param {?} key
     * @param {?} zones
     * @return {?}
     */
    function (context, key, zones) {
        var /** @type {?} */ itemsByZones = this.itemsByZones(context, key, zones);
        return this.mapItemPropsToNames(itemsByZones);
    };
    /**
     * @param {?} itemsByZones
     * @return {?}
     */
    UIMeta.prototype.mapItemPropsToNames = /**
     * @param {?} itemsByZones
     * @return {?}
     */
    function (itemsByZones) {
        var _this = this;
        var /** @type {?} */ namesByZones = new Map();
        MapWrapper.iterable(itemsByZones).forEach(function (value, key) {
            if (isPresent(value) && isArray(value)) {
                var /** @type {?} */ names = [];
                try {
                    for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var item = value_1_1.value;
                        if (item instanceof ItemProperties) {
                            names.push((/** @type {?} */ (item)).name);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                namesByZones.set(key, names);
            }
            else {
                namesByZones.set(key, _this.mapItemPropsToNames(value));
            }
            var e_2, _a;
        });
        return namesByZones;
    };
    /**
     * @param {?} context
     * @param {?} key
     * @param {?} defaultPredecessor
     * @return {?}
     */
    UIMeta.prototype.predecessorMap = /**
     * @param {?} context
     * @param {?} key
     * @param {?} defaultPredecessor
     * @return {?}
     */
    function (context, key, defaultPredecessor) {
        var /** @type {?} */ fieldInfos = this.itemProperties(context, key, false);
        var /** @type {?} */ predecessors = MapWrapper.groupBy(fieldInfos, function (item) {
            var /** @type {?} */ pred = item.properties.get(UIMeta.KeyAfter);
            return isPresent(pred) ? pred : defaultPredecessor;
        });
        return predecessors;
    };
    /**
     * @param {?} context
     * @param {?} key
     * @param {?} zones
     * @return {?}
     */
    UIMeta.prototype.itemList = /**
     * @param {?} context
     * @param {?} key
     * @param {?} zones
     * @return {?}
     */
    function (context, key, zones) {
        var /** @type {?} */ predecessors = this.predecessorMap(context, key, zones[0]);
        var /** @type {?} */ result = [];
        try {
            for (var zones_1 = __values(zones), zones_1_1 = zones_1.next(); !zones_1_1.done; zones_1_1 = zones_1.next()) {
                var zone = zones_1_1.value;
                this.accumulatePrecessors(predecessors, zone, result);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (zones_1_1 && !zones_1_1.done && (_a = zones_1.return)) _a.call(zones_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
        var e_3, _a;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    UIMeta.prototype.isZoneReference = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        // keys of the form 'z<Name>' and 'foo.bar.z<Name>' are considered zone keys
        var /** @type {?} */ lastDot = key.lastIndexOf('.');
        var /** @type {?} */ suffix = (lastDot === -1) ? key : key.substring(lastDot + 1);
        return (suffix.length > 1) && (suffix[0] === 'z') && (suffix[1].toUpperCase() === suffix[1] // is uppercase ?s
        );
    };
    /**
     * @param {?} context
     * @param {?} property
     * @param {?} zones
     * @return {?}
     */
    UIMeta.prototype.itemsByZones = /**
     * @param {?} context
     * @param {?} property
     * @param {?} zones
     * @return {?}
     */
    function (context, property, zones) {
        var _this = this;
        var /** @type {?} */ predecessors = this.predecessorMap(context, property, zones[0]);
        var /** @type {?} */ byZone = new Map();
        MapWrapper.iterable(predecessors).forEach(function (value, zone) {
            if (_this.isZoneReference(zone)) {
                var /** @type {?} */ list = [];
                _this.accumulatePrecessors(predecessors, zone, list);
                FieldPath.setFieldValue(byZone, zone, list);
            }
        });
        return byZone;
    };
    // recursive decent of predecessor tree...
    /**
     * @param {?} predecessors
     * @param {?} key
     * @param {?} result
     * @return {?}
     */
    UIMeta.prototype.accumulatePrecessors = /**
     * @param {?} predecessors
     * @param {?} key
     * @param {?} result
     * @return {?}
     */
    function (predecessors, key, result) {
        var /** @type {?} */ items = predecessors.get(key);
        if (isBlank(items)) {
            return;
        }
        ListWrapper.sort(items, function (o1, o2) {
            var /** @type {?} */ r1 = o1.properties.get(UIMeta.KeyRank);
            var /** @type {?} */ r2 = o2.properties.get(UIMeta.KeyRank);
            if (r1 === null) {
                r1 = 100;
            }
            if (r2 === null) {
                r2 = 100;
            }
            return (r1 === r2) ? 0 : (r1 === null) ? 1 : (r2 === null) ? -1 : (r1 - r2);
        });
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (!item.hidden) {
                    result.push(item);
                }
                this.accumulatePrecessors(predecessors, item.name, result);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _a;
    };
    /**
     * Called by Parser to handle decls like 'zLeft => lastName#required'
     *
     */
    /**
     * Called by Parser to handle decls like 'zLeft => lastName#required'
     *
     * @param {?} itemName
     * @param {?} contextPreds
     * @param {?} predecessor
     * @param {?} traits
     * @param {?} lineNumber
     * @return {?}
     */
    UIMeta.prototype.addPredecessorRule = /**
     * Called by Parser to handle decls like 'zLeft => lastName#required'
     *
     * @param {?} itemName
     * @param {?} contextPreds
     * @param {?} predecessor
     * @param {?} traits
     * @param {?} lineNumber
     * @return {?}
     */
    function (itemName, contextPreds, predecessor, traits, lineNumber) {
        if (isBlank(predecessor) && isBlank(traits)) {
            return null;
        }
        var /** @type {?} */ key = this.scopeKeyForSelector(contextPreds);
        if (isBlank(key) || key === UIMeta.KeyClass) {
            key = UIMeta.KeyField;
        }
        var /** @type {?} */ selector = new Array();
        ListWrapper.addAll(selector, contextPreds);
        selector.push(new Selector(key, itemName));
        var /** @type {?} */ props = new Map();
        if (isPresent(predecessor)) {
            props.set(UIMeta.KeyAfter, predecessor);
        }
        if (isPresent(traits)) {
            props.set(UIMeta.KeyTrait, traits);
        }
        var /** @type {?} */ rule = new Rule(selector, props, 0, lineNumber);
        this.addRule(rule);
        return rule;
    };
    /**
     * @param {?} fieldsByZones
     * @param {?} zoneList
     * @param {?} key
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.flattenVisible = /**
     * @param {?} fieldsByZones
     * @param {?} zoneList
     * @param {?} key
     * @param {?} context
     * @return {?}
     */
    function (fieldsByZones, zoneList, key, context) {
        var /** @type {?} */ result = [];
        if (isPresent(fieldsByZones)) {
            try {
                for (var zoneList_1 = __values(zoneList), zoneList_1_1 = zoneList_1.next(); !zoneList_1_1.done; zoneList_1_1 = zoneList_1.next()) {
                    var zone = zoneList_1_1.value;
                    var /** @type {?} */ fields = fieldsByZones.get(zone);
                    if (isBlank(fields)) {
                        continue;
                    }
                    try {
                        for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                            var field = fields_1_1.value;
                            context.push();
                            context.set(key, field);
                            if (context.booleanPropertyForKey(UIMeta.KeyVisible, false)) {
                                result.push(field);
                            }
                            context.pop();
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (zoneList_1_1 && !zoneList_1_1.done && (_b = zoneList_1.return)) _b.call(zoneList_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        return result;
        var e_6, _b, e_5, _a;
    };
    /**
     * @param {?} className
     * @return {?}
     */
    UIMeta.prototype.displayKeyForClass = /**
     * @param {?} className
     * @return {?}
     */
    function (className$$1) {
        // performance: should use registerDerivedValue('...', new Context.StaticDynamicWrapper
        // to get cached resolution here...
        var /** @type {?} */ context = this.newContext();
        context.set(UIMeta.KeyLayout, 'LabelField');
        context.set(UIMeta.KeyClass, className$$1);
        var /** @type {?} */ fields = this.itemProperties(context, UIMeta.KeyField, true);
        return ListWrapper.isEmpty(fields) ? '$toString' : fields[0].name;
    };
    /**
     * @param {?} className
     * @param {?} propertiesValue
     * @return {?}
     */
    UIMeta.prototype.displayLabel = /**
     * @param {?} className
     * @param {?} propertiesValue
     * @return {?}
     */
    function (className$$1, propertiesValue) {
        if (isPresent(propertiesValue)) {
            return propertiesValue;
        }
        return this.displayKeyForClass(className$$1);
    };
    /**
     * @param {?} key
     * @param {?} defaultValue
     * @return {?}
     */
    UIMeta.prototype.createLocalizedString = /**
     * @param {?} key
     * @param {?} defaultValue
     * @return {?}
     */
    function (key, defaultValue) {
        assert(isPresent(this._currentRuleSet), 'Attempt to create localized string without currentRuleSet in place');
        return new LocalizedString(this, this._currentRuleSet.filePath, key, defaultValue);
    };
    Object.defineProperty(UIMeta.prototype, "routingService", {
        get: /**
         * @return {?}
         */
        function () {
            return (isPresent(this._injector)) ? this._injector.get(RoutingService) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIMeta.prototype, "env", {
        get: /**
         * @return {?}
         */
        function () {
            return (isPresent(this._injector)) ? this._injector.get(Environment) : new Environment();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIMeta.prototype, "appConfig", {
        get: /**
         * @return {?}
         */
        function () {
            return (isPresent(this._injector)) ? this._injector.get(AppConfig) : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Registers framework level components and listen for user level rules to be registered.
     * After we register user level rules it will load application.oss.
     *
     *
     * @param {?} sysReferences
     * @return {?}
     */
    UIMeta.prototype.registerComponents = /**
     * Registers framework level components and listen for user level rules to be registered.
     * After we register user level rules it will load application.oss.
     *
     *
     * @param {?} sysReferences
     * @return {?}
     */
    function (sysReferences) {
        assert(isPresent(this.injector), 'Cannot register components without Injector in order' +
            ' to get access to ComponentRegistry Service');
        assert(this.env.inTest || isPresent(this.appConfig.get(UIMeta.AppConfigUserRulesParam)), 'Unable to initialize MetaUI as user rules are missing. please use:' +
            ' metaui.rules.user-rules configuration param');
        this.componentRegistry = this.injector.get(ComponentRegistry);
        if (isPresent(this.componentRegistry)) {
            this.componentRegistry.registerTypes(sysReferences);
            if (!this.env.inTest) {
                var /** @type {?} */ userReferences = this.appConfig.get(UIMeta.AppConfigUserRulesParam);
                try {
                    for (var userReferences_1 = __values(userReferences), userReferences_1_1 = userReferences_1.next(); !userReferences_1_1.done; userReferences_1_1 = userReferences_1.next()) {
                        var uRule = userReferences_1_1.value;
                        this.componentRegistry.registerTypes(uRule);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (userReferences_1_1 && !userReferences_1_1.done && (_a = userReferences_1.return)) _a.call(userReferences_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                this.loadApplicationRules();
            }
        }
        else if (!this.env.inTest) {
            warn('UIMeta.registerComponents() No components were registered !');
        }
        var e_7, _a;
    };
    /**
     *
     * Just need to call it different than the other fireAction as I can not do any method
     * overloading here.
     *
     */
    /**
     *
     * Just need to call it different than the other fireAction as I can not do any method
     * overloading here.
     *
     * @param {?} action
     * @param {?} context
     * @return {?}
     */
    UIMeta.prototype.fireActionFromProps = /**
     *
     * Just need to call it different than the other fireAction as I can not do any method
     * overloading here.
     *
     * @param {?} action
     * @param {?} context
     * @return {?}
     */
    function (action, context) {
        context.push();
        var /** @type {?} */ actionCategory = action.properties.get(ObjectMeta.KeyActionCategory);
        if (isBlank(actionCategory)) {
            actionCategory = ObjectMeta.DefaultActionCategory;
        }
        context.set(ObjectMeta.KeyActionCategory, actionCategory);
        context.set(ObjectMeta.KeyAction, action.name);
        this._fireAction(context, false);
        context.pop();
    };
    /**
     * @param {?} context
     * @param {?=} withBackAction
     * @return {?}
     */
    UIMeta.prototype.fireAction = /**
     * @param {?} context
     * @param {?=} withBackAction
     * @return {?}
     */
    function (context, withBackAction) {
        if (withBackAction === void 0) { withBackAction = false; }
        context.push();
        this._fireAction(context, withBackAction);
        context.pop();
    };
    /**
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    UIMeta.prototype._fireAction = /**
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    function (context, withBackAction) {
        var /** @type {?} */ actionResults = context.propertyForKey('actionResults');
        if (isBlank(actionResults) || !this.isRoute(actionResults)) {
            return;
        }
        this.naviateToPage(context, actionResults, withBackAction);
    };
    /**
     * @param {?} context
     * @param {?} route
     * @param {?} withBackAction
     * @return {?}
     */
    UIMeta.prototype.naviateToPage = /**
     * @param {?} context
     * @param {?} route
     * @param {?} withBackAction
     * @return {?}
     */
    function (context, route, withBackAction) {
        var /** @type {?} */ params = this.prepareRoute(context, withBackAction);
        var /** @type {?} */ uiContex = /** @type {?} */ (context);
        this.routingService.navigateWithRoute(route, params, uiContex.object);
    };
    /**
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    UIMeta.prototype.prepareRoute = /**
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    function (context, withBackAction) {
        var /** @type {?} */ params = {};
        var /** @type {?} */ pageBindings = context.propertyForKey('pageBindings');
        if (isPresent(pageBindings)) {
            pageBindings.forEach(function (v, k) {
                if (k !== ObjectMeta.KeyObject) {
                    (/** @type {?} */ (params))[k] = context.resolveValue(v);
                }
            });
            if (isPresent(withBackAction)) {
                (/** @type {?} */ (params))['b'] = withBackAction;
            }
        }
        return params;
    };
    /**
     * @param {?} component
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    UIMeta.prototype.prepareRouteForComponent = /**
     * @param {?} component
     * @param {?} context
     * @param {?} withBackAction
     * @return {?}
     */
    function (component, context, withBackAction) {
        var /** @type {?} */ params = {};
        var /** @type {?} */ pageBindings = context.propertyForKey('pageBindings');
        if (isPresent(pageBindings)) {
            pageBindings.forEach(function (v, k) {
                component[k] = v;
            });
        }
        return params;
    };
    /**
     * @param {?} module
     * @param {?=} activatedPath
     * @return {?}
     */
    UIMeta.prototype.gotoModule = /**
     * @param {?} module
     * @param {?=} activatedPath
     * @return {?}
     */
    function (module, activatedPath) {
        this.env.deleteValue(ACTIVE_CNTX);
        var /** @type {?} */ context = this.newContext();
        context.push();
        context.set(UIMeta.KeyModule, module.name);
        var /** @type {?} */ pageName = context.propertyForKey(UIMeta.KeyHomePage);
        var /** @type {?} */ route = this.routingService.routeForPage(pageName, module.name.toLowerCase(), activatedPath);
        if (activatedPath === '/') {
            activatedPath = '';
        }
        var /** @type {?} */ path = activatedPath + "/" + route.path;
        var /** @type {?} */ params = this.prepareRoute(context, null);
        context.pop();
        this.routingService.navigate([path, params], { skipLocationChange: true });
    };
    /**
     * @param {?} actionResult
     * @return {?}
     */
    UIMeta.prototype.isRoute = /**
     * @param {?} actionResult
     * @return {?}
     */
    function (actionResult) {
        return isStringMap(actionResult) && isPresent(actionResult['path']);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    UIMeta.prototype.compPageWithName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ currType = this.componentRegistry.nameToType.get(name);
        if (isBlank(currType)) {
            assert(false, name + ' component does not exists. Create Dummy Component instead of' +
                ' throwing this error');
            return;
        }
        return currType;
    };
    // caller must push/pop!
    /**
     * @param {?} context
     * @param {?} result
     * @param {?} zones
     * @return {?}
     */
    UIMeta.prototype.actionsByCategory = /**
     * @param {?} context
     * @param {?} result
     * @param {?} zones
     * @return {?}
     */
    function (context, result, zones) {
        var /** @type {?} */ catNames = [];
        var /** @type {?} */ actionCategories = this.itemList(context, ObjectMeta.KeyActionCategory, zones);
        if (isPresent(actionCategories)) {
            actionCategories.forEach(function (item) { return catNames.push(item.name); });
        }
        this.addActionsForCategories(context, result, catNames);
        return actionCategories;
    };
    /**
     * @param {?} context
     * @param {?} result
     * @param {?} catNames
     * @return {?}
     */
    UIMeta.prototype.addActionsForCategories = /**
     * @param {?} context
     * @param {?} result
     * @param {?} catNames
     * @return {?}
     */
    function (context, result, catNames) {
        try {
            for (var catNames_1 = __values(catNames), catNames_1_1 = catNames_1.next(); !catNames_1_1.done; catNames_1_1 = catNames_1.next()) {
                var cat = catNames_1_1.value;
                context.push();
                if (cat !== ObjectMeta.DefaultActionCategory) {
                    context.set(ObjectMeta.KeyActionCategory, cat);
                }
                this.collectActionsByCategory(context, result, cat);
                context.pop();
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (catNames_1_1 && !catNames_1_1.done && (_a = catNames_1.return)) _a.call(catNames_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var e_8, _a;
    };
    /**
     * @param {?} context
     * @param {?} result
     * @param {?} targetCat
     * @return {?}
     */
    UIMeta.prototype.collectActionsByCategory = /**
     * @param {?} context
     * @param {?} result
     * @param {?} targetCat
     * @return {?}
     */
    function (context, result, targetCat) {
        var /** @type {?} */ actionInfos = this.itemProperties(context, ObjectMeta.KeyAction, true);
        try {
            for (var actionInfos_1 = __values(actionInfos), actionInfos_1_1 = actionInfos_1.next(); !actionInfos_1_1.done; actionInfos_1_1 = actionInfos_1.next()) {
                var actionInfo = actionInfos_1_1.value;
                context.push();
                context.set(ObjectMeta.KeyAction, actionInfo.name);
                var /** @type {?} */ visible = context.booleanPropertyForKey(ObjectMeta.KeyVisible, true);
                context.pop();
                if (visible) {
                    var /** @type {?} */ category = actionInfo.properties.get(ObjectMeta.KeyActionCategory);
                    if (category == null) {
                        category = ObjectMeta.DefaultActionCategory;
                    }
                    if (targetCat !== category) {
                        continue;
                    }
                    var /** @type {?} */ forCategory = result.get(category);
                    if (isBlank(forCategory)) {
                        forCategory = [];
                        result.set(category, forCategory);
                    }
                    forCategory.push(actionInfo);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (actionInfos_1_1 && !actionInfos_1_1.done && (_a = actionInfos_1.return)) _a.call(actionInfos_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        var e_9, _a;
    };
    /**
     * @param {?=} context
     * @param {?=} checkVisibility
     * @return {?}
     */
    UIMeta.prototype.computeModuleInfo = /**
     * @param {?=} context
     * @param {?=} checkVisibility
     * @return {?}
     */
    function (context, checkVisibility) {
        if (context === void 0) { context = this.newContext(); }
        if (checkVisibility === void 0) { checkVisibility = true; }
        var /** @type {?} */ moduleInfo = new ModuleInfo();
        moduleInfo.modules = [];
        var /** @type {?} */ allModuleProps = this.itemList(context, UIMeta.KeyModule, UIMeta.ActionZones);
        moduleInfo.moduleNames = [];
        moduleInfo.moduleByNames = new Map();
        try {
            for (var allModuleProps_1 = __values(allModuleProps), allModuleProps_1_1 = allModuleProps_1.next(); !allModuleProps_1_1.done; allModuleProps_1_1 = allModuleProps_1.next()) {
                var module = allModuleProps_1_1.value;
                context.push();
                context.set(UIMeta.KeyModule, module.name);
                if (checkVisibility && !context.booleanPropertyForKey(UIMeta.KeyVisible, true)) {
                    context.pop();
                    continue;
                }
                moduleInfo.moduleNames.push(module.name);
                // // todo: create typescript anotation
                // context.push();
                // context.set("homeForClasses", true);
                // let homeClasses: Array<string> = this.itemNames(context, UIMeta.KeyClass);
                // context.pop();
                var /** @type {?} */ modProperties = new ItemProperties(module.name, context.allProperties(), false);
                moduleInfo.modules.push(modProperties);
                moduleInfo.moduleByNames.set(module.name, modProperties);
                context.pop();
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (allModuleProps_1_1 && !allModuleProps_1_1.done && (_a = allModuleProps_1.return)) _a.call(allModuleProps_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        context.push();
        context.set(UIMeta.KeyModule, moduleInfo.moduleNames);
        moduleInfo.actionsByCategory = new Map();
        moduleInfo.actionCategories = this.actionsByCategory(context, moduleInfo.actionsByCategory, UIMeta.ModuleActionZones);
        context.pop();
        return moduleInfo;
        var e_10, _a;
    };
    /**
     * @param {?} moduleName
     * @param {?=} context
     * @return {?}
     */
    UIMeta.prototype.currentModuleLabel = /**
     * @param {?} moduleName
     * @param {?=} context
     * @return {?}
     */
    function (moduleName, context) {
        if (context === void 0) { context = this.newContext(); }
        context.push();
        context.set(UIMeta.KeyModule, moduleName);
        var /** @type {?} */ label = context.propertyForKey(UIMeta.KeyLabel);
        context.pop();
        return label;
    };
    UIMeta.KeyOperation = 'operation';
    UIMeta.KeyModule = 'module';
    UIMeta.KeyLayout = 'layout';
    UIMeta.KeyArea = 'area';
    UIMeta.KeyEditing = 'editing';
    UIMeta.KeyAfter = 'after';
    UIMeta.KeyHidden = 'hidden';
    UIMeta.KeyLabel = 'label';
    UIMeta.KeyComponentName = 'component';
    UIMeta.KeyBindings = 'bindings';
    UIMeta.KeyHomePage = 'homePage';
    UIMeta.KeyZonePath = 'zonePath';
    UIMeta.PropFieldsByZone = 'fieldsByZone';
    UIMeta.PropIsFieldsByZone = 'fiveZoneLayout';
    UIMeta.PropActionsByCategory = 'actionsByCategory';
    UIMeta.PropActionCategories = 'actionCategories';
    UIMeta.PropFieldPropertyList = 'fieldPropertyList';
    UIMeta.PropLayoutsByZone = 'layoutsByZone';
    UIMeta.KeyWrapperComponent = 'wrapperComponent';
    UIMeta.KeyWrapperBinding = 'wrapperBindings';
    UIMeta.RootPredecessorKey = '_root';
    UIMeta.ZoneMain = 'zMain';
    UIMeta.ZoneTop = 'zTop';
    UIMeta.ZoneLeft = 'zLeft';
    UIMeta.ZoneMiddle = 'zMiddle';
    UIMeta.ZoneRight = 'zRight';
    UIMeta.ZoneBottom = 'zBottom';
    UIMeta.ZoneDetail = 'zDetail';
    UIMeta.AppConfigRuleFilesParam = 'metaui.rules.file-names';
    UIMeta.AppConfigUserRulesParam = 'metaui.rules.user-rules';
    UIMeta.ZonesTLRMB = [
        UIMeta.ZoneTop, UIMeta.ZoneLeft, UIMeta.ZoneMiddle,
        UIMeta.ZoneRight, UIMeta.ZoneBottom
    ];
    UIMeta.ZonesMTLRB = [
        UIMeta.ZoneMain, UIMeta.ZoneTop, UIMeta.ZoneLeft, UIMeta.ZoneRight, UIMeta.ZoneBottom
    ];
    UIMeta.ZonesDetail = [UIMeta.ZoneDetail];
    UIMeta._instance = null;
    UIMeta.ModuleActionZones = ['zNav', 'zGlobal'];
    UIMeta.ActionZones = ['zGlobal', 'zMain', 'zGeneral'];
    return UIMeta;
}(ObjectMeta));
var ModuleInfo = /** @class */ (function () {
    function ModuleInfo() {
    }
    return ModuleInfo;
}());
var LocalizedString = /** @class */ (function (_super) {
    __extends(LocalizedString, _super);
    function LocalizedString(meta, _module, _key, _defaultValue) {
        var _this = _super.call(this) || this;
        _this.meta = meta;
        _this._module = _module;
        _this._key = _key;
        _this._defaultValue = _defaultValue;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    LocalizedString.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        // let clazz = context.values.get('class');
        // if (isPresent(this._key) && isPresent(this.meta.i18nService)) {
        //     let i18nKey = clazz + '.' + this._key;
        //     localizedString = this.meta.i18nService.instant(i18nKey);
        //
        //     // when it return the same string most likely it means there is no
        //     // translation so default it to null
        //     localizedString = (localizedString === i18nKey) ? null : localizedString;
        // }
        // if (isBlank(localizedString) || this._key === ObjectMeta.KeyField) {
        //     return this._defaultValue;
        // }
        return this._defaultValue;
    };
    /**
     * @return {?}
     */
    LocalizedString.prototype.toString = /**
     * @return {?}
     */
    function () {
        return 'LocaledString: {' + this._key + ' - ' + this._defaultValue + ' }';
    };
    return LocalizedString;
}(DynamicPropertyValue));
var LocalizedLabelString = /** @class */ (function (_super) {
    __extends(LocalizedLabelString, _super);
    function LocalizedLabelString(meta) {
        var _this = _super.call(this, meta, LocalizedLabelString.DefaultModule, null, null) || this;
        _this.meta = meta;
        _this.propertyAwaking = true;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    LocalizedLabelString.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        if (isBlank(this._key)) {
            var /** @type {?} */ scopeKey = context.values.get(Meta.ScopeKey);
            var /** @type {?} */ scopeVal = context.values.get(scopeKey);
            this._defaultValue = UIMeta.defaultLabelForIdentifier(scopeVal);
            this._key = scopeKey;
        }
        return _super.prototype.evaluate.call(this, context);
    };
    /**
     * @param {?} map
     * @return {?}
     */
    LocalizedLabelString.prototype.awakeForPropertyMap = /**
     * @param {?} map
     * @return {?}
     */
    function (map) {
        return new LocalizedLabelString(this.meta);
    };
    LocalizedLabelString.DefaultModule = 'default';
    return LocalizedLabelString;
}(LocalizedString));
var PropFieldsByZoneResolver = /** @class */ (function (_super) {
    __extends(PropFieldsByZoneResolver, _super);
    function PropFieldsByZoneResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    PropFieldsByZoneResolver.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var /** @type {?} */ m = (/** @type {?} */ (context.meta)).itemNamesByZones(context, UIMeta.KeyField, (/** @type {?} */ (context.meta)).zones(context));
        var /** @type {?} */ zonePath = (/** @type {?} */ (context.meta)).zonePath(context);
        if (isPresent(zonePath)) {
            m = /** @type {?} */ (FieldPath.getFieldValue(m, zonePath));
            if (isBlank(m)) {
                m = new Map();
            }
        }
        return m;
    };
    return PropFieldsByZoneResolver;
}(StaticallyResolvable));
var PropFieldPropertyListResolver = /** @class */ (function (_super) {
    __extends(PropFieldPropertyListResolver, _super);
    function PropFieldPropertyListResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    PropFieldPropertyListResolver.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return (/** @type {?} */ (context.meta)).fieldList(context);
    };
    return PropFieldPropertyListResolver;
}(StaticallyResolvable));
var PropLayoutsByZoneResolver = /** @class */ (function (_super) {
    __extends(PropLayoutsByZoneResolver, _super);
    function PropLayoutsByZoneResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    PropLayoutsByZoneResolver.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return (/** @type {?} */ (context.meta)).itemNamesByZones(context, UIMeta.KeyLayout, (/** @type {?} */ (context.meta)).zones(context));
    };
    return PropLayoutsByZoneResolver;
}(StaticallyResolvable));
var _DefaultLabelGenerator = /** @class */ (function (_super) {
    __extends(_DefaultLabelGenerator, _super);
    function _DefaultLabelGenerator(_key) {
        var _this = _super.call(this) || this;
        _this._key = _key;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    _DefaultLabelGenerator.prototype.evaluate = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        var /** @type {?} */ fieldName = context.values.get(this._key);
        return (isPresent(fieldName) && isString(fieldName)) ?
            UIMeta.defaultLabelForIdentifier(fieldName) : null;
    };
    return _DefaultLabelGenerator;
}(StaticallyResolvable));
/**
 * Load User defined meta data. This class is triggered as soon as we create a context and
 * pass an object into it. Based on the object we notify different Observers passing name
 * of the class and here we search if we have any Rules available for current className and
 * try to load the Rule.
 */
var /**
 * Load User defined meta data. This class is triggered as soon as we create a context and
 * pass an object into it. Based on the object we notify different Observers passing name
 * of the class and here we search if we have any Rules available for current className and
 * try to load the Rule.
 */
UserMetaDataProvider = /** @class */ (function () {
    function UserMetaDataProvider() {
    }
    /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    UserMetaDataProvider.prototype.notify = /**
     * @param {?} meta
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (meta, key, value) {
        var /** @type {?} */ aRules;
        var /** @type {?} */ uiMeta = /** @type {?} */ (meta);
        if (uiMeta._testRules.has(value + 'Rule')) {
            // since we are in development mode and test mode is on we can check extra repository
            // used by tests, we need to check if we are not running unittest and a class is not
            // application defined but unittest defined rule
            if (uiMeta._testRules.has(value + 'Rule') &&
                isPresent(uiMeta._testRules.get(value + 'Rule').oss)) {
                aRules = uiMeta._testRules.get(value + 'Rule').oss;
            }
            meta.loadUserRule(aRules, value);
        }
        else if (isPresent(uiMeta.appConfig) &&
            uiMeta.appConfig.get(UIMeta.AppConfigUserRulesParam)) {
            var /** @type {?} */ userReferences = uiMeta.appConfig.get(UIMeta.AppConfigUserRulesParam);
            for (var /** @type {?} */ i in userReferences) {
                if (isPresent(userReferences[i][value + 'Rule']) &&
                    isPresent(userReferences[i][value + 'Rule'].oss)) {
                    aRules = userReferences[i][value + 'Rule'].oss;
                }
            }
            meta.loadUserRule(aRules, value);
        }
    };
    return UserMetaDataProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Constant represent current active and mainly latest Context
 *
 */
var /** @type {?} */ ACTIVE_CNTX = 'CurrentMC';
// define set of properties which will be skipped as they are defined as inputs or  added by
// angular
var /** @type {?} */ IMPLICIT_PROPERTIES = [
    'module', 'layout', 'operation', 'class', 'object', 'actionCategory', 'action', 'field',
    'pushNewContext'
];
var /** @type {?} */ IMMUTABLE_PROPERTIES = [
    'module', 'layout', 'operation', 'class', 'action', 'field', 'pushNewContext'
];
var MetaContextComponent = /** @class */ (function (_super) {
    __extends(MetaContextComponent, _super);
    function MetaContextComponent(elementRef, env, parentContainer) {
        var _this = _super.call(this, env, null) || this;
        _this.elementRef = elementRef;
        _this.env = env;
        _this.parentContainer = parentContainer;
        _this.beforeContextSet = new EventEmitter();
        _this.onContextChanged = new EventEmitter();
        _this.afterContextSet = new EventEmitter();
        _this.onAction = new EventEmitter();
        /**
         * Flag that tells us that component is fully rendered
         *
         */
        _this.viewInitialized = false;
        /**
         *
         * Marks MetaContext or the root MetaContext that created a new Context
         *
         */
        _this.contextCreated = false;
        _this.bindingKeys = [];
        return _this;
    }
    /**
     * @return {?}
     */
    MetaContextComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.initBindings();
        this.hasObject = this._hasObject();
        // MetaContextComponent.stackDepth++;
        // console.log(this.indent() + '=> ngOnInit:', this.contextKey());
        // Initial push, when component is first initialized the rest is done based on changes.
        this.pushPop(true);
        if (!this.env.hasValue('parent-cnx')) {
            this.env.setValue('parent-cnx', this);
        }
    };
    /**
     * For any other immutable object detect changes here and refresh the context stack
     *
     * @param changes
     */
    /**
     * For any other immutable object detect changes here and refresh the context stack
     *
     * @param {?} changes
     * @return {?}
     */
    MetaContextComponent.prototype.ngOnChanges = /**
     * For any other immutable object detect changes here and refresh the context stack
     *
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        // console.log(this.indent() + '    => ngOnChanges', this.contextKey());
        try {
            // console.log(this.indent() + '    => ngOnChanges', this.contextKey());
            for (var IMMUTABLE_PROPERTIES_1 = __values(IMMUTABLE_PROPERTIES), IMMUTABLE_PROPERTIES_1_1 = IMMUTABLE_PROPERTIES_1.next(); !IMMUTABLE_PROPERTIES_1_1.done; IMMUTABLE_PROPERTIES_1_1 = IMMUTABLE_PROPERTIES_1.next()) {
                var name_1 = IMMUTABLE_PROPERTIES_1_1.value;
                if (isPresent(changes[name_1])
                    && (changes[name_1].currentValue !== changes[name_1].previousValue)) {
                    this.initBindings();
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (IMMUTABLE_PROPERTIES_1_1 && !IMMUTABLE_PROPERTIES_1_1.done && (_a = IMMUTABLE_PROPERTIES_1.return)) _a.call(IMMUTABLE_PROPERTIES_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // in case object is coming late e.g. from some reactive API like REST then we
        // do not get it into ngInit but it will be here.
        if (this.viewInitialized && isPresent(changes['object']) && isPresent(this.object)) {
            this.initBindings();
        }
        var e_1, _a;
    };
    /**
     * Ng check is trigged after view is fully inialized and we want to push everything new
     * properties to the context and evaluate everything.
     *
     *
     */
    /**
     * Ng check is trigged after view is fully inialized and we want to push everything new
     * properties to the context and evaluate everything.
     *
     *
     * @return {?}
     */
    MetaContextComponent.prototype.ngDoCheck = /**
     * Ng check is trigged after view is fully inialized and we want to push everything new
     * properties to the context and evaluate everything.
     *
     *
     * @return {?}
     */
    function () {
        if (this.viewInitialized) {
            this.hasObject = this._hasObject();
            // MetaContextComponent.stackDepth++;
            this.pushPop(true);
            // console.log(this.indent() + '=> ngDoCheck(CHANGED)', this.contextKey());
            if (isPresent(this.object) && !equals(this.prevObject, this.object)) {
                this.updateModel();
            }
        }
    };
    /**
     * We want to start detecting changes only after view is fully checked
     */
    /**
     * We want to start detecting changes only after view is fully checked
     * @return {?}
     */
    MetaContextComponent.prototype.ngAfterViewInit = /**
     * We want to start detecting changes only after view is fully checked
     * @return {?}
     */
    function () {
        if (!this.viewInitialized) {
            // console.log(this.indent() + '=> ngAfterViewInit:', this.contextKey());
            // MetaContextComponent.stackDepth--;
            this.pushPop(false);
        }
    };
    /**
     * @return {?}
     */
    MetaContextComponent.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
        if (this.viewInitialized) {
            // console.log(this.indent() + '=> ngAfterViewChecked:', this.contextKey());
            // MetaContextComponent.stackDepth--;
            this.pushPop(false);
        }
        else {
            this.viewInitialized = true;
        }
    };
    /**
     *
     * This is our key method that triggers all the interaction inside MetaUI world. Here we
     * push context keys and their values to the stack and this is the thing that triggers
     * rule recalculation which give us updated  properties. Those are then used by
     * MetaIncludeComponent to render the UI.
     *
     * myContext is current context for this MetaContext Component.
     *
     * @param {?} isPush identifies if we are pushing or popping to context stack
     * @return {?}
     */
    MetaContextComponent.prototype.pushPop = /**
     *
     * This is our key method that triggers all the interaction inside MetaUI world. Here we
     * push context keys and their values to the stack and this is the thing that triggers
     * rule recalculation which give us updated  properties. Those are then used by
     * MetaIncludeComponent to render the UI.
     *
     * myContext is current context for this MetaContext Component.
     *
     * @param {?} isPush identifies if we are pushing or popping to context stack
     * @return {?}
     */
    function (isPush) {
        // console.log(this.indent() + '=> pushPop: isPush' + isPush, this.contextKey());
        var /** @type {?} */ activeContext = this.activeContext();
        assert(isPush || isPresent(activeContext), 'pop(): Missing context');
        var /** @type {?} */ forceCreate = isPush && (isPresent(this.pushNewContext) && this.pushNewContext);
        if (isBlank(activeContext) || forceCreate) {
            var /** @type {?} */ metaUI = UIMeta.getInstance();
            activeContext = metaUI.newContext(forceCreate);
            this.contextCreated = true;
            this.env.push(ACTIVE_CNTX, activeContext);
        }
        if (isPush) {
            activeContext.push();
            if (isPresent(this._scopeBinding) && this.hasObject) {
                this.beforeContextSet.emit(this._scopeBinding);
                activeContext.setScopeKey(this._scopeBinding);
                this.afterContextSet.emit(this._scopeBinding);
            }
            else {
                for (var /** @type {?} */ index = 0; index < this.bindingKeys.length; index++) {
                    var /** @type {?} */ key = this.bindingKeys[index];
                    var /** @type {?} */ value = this.bindingsMap.get(key);
                    this.beforeContextSet.emit(value);
                    activeContext.set(key, value);
                    this.afterContextSet.emit(value);
                }
            }
            // Save created content to local MetaContext
            this._myContext = activeContext.snapshot().hydrate(false);
        }
        else {
            activeContext.pop();
            if (this.contextCreated) {
                this.env.pop(ACTIVE_CNTX);
            }
        }
    };
    /**
     * Just for troubleshooting to print current context and assignments
     *
     */
    /**
     * Just for troubleshooting to print current context and assignments
     *
     * @return {?}
     */
    MetaContextComponent.prototype.debugString = /**
     * Just for troubleshooting to print current context and assignments
     *
     * @return {?}
     */
    function () {
        if (isPresent(this._myContext)) {
            return this._myContext.debugString();
        }
    };
    /**
     * For debugging to identify current key
     */
    // contextKey(): string
    // {
    //     let cnxKey = '';
    //     if (isPresent(this.bindingKeys) && this.bindingKeys.length > 0) {
    //         this.bindingKeys.forEach((name) =>
    //         {
    //             if (name === 'object') {
    //                 cnxKey += name;
    //             } else {
    //                 cnxKey += name + this.bindingsMap.get(name);
    //             }
    //
    //
    //         });
    //     } else if (isPresent(this._scopeBinding)) {
    //         cnxKey += this._scopeBinding;
    //     }
    //     return cnxKey;
    // }
    /**
     *
     * Every meta context component which pushing certain properties to stack has its own context
     * that lives until component is destroyed
     *
     */
    /**
     *
     * Every meta context component which pushing certain properties to stack has its own context
     * that lives until component is destroyed
     *
     * @return {?}
     */
    MetaContextComponent.prototype.myContext = /**
     *
     * Every meta context component which pushing certain properties to stack has its own context
     * that lives until component is destroyed
     *
     * @return {?}
     */
    function () {
        return this._myContext;
        // let cnxKey = this.contextKey();
        // return this.env.getValue(cnxKey);
    };
    /**
     * We keep the most current and latest context to environment to be read by any Child
     * MetaContext for purpose of creation new context and it needs info what was already pushed
     * onto the stack.
     *
     */
    /**
     * We keep the most current and latest context to environment to be read by any Child
     * MetaContext for purpose of creation new context and it needs info what was already pushed
     * onto the stack.
     *
     * @return {?}
     */
    MetaContextComponent.prototype.activeContext = /**
     * We keep the most current and latest context to environment to be read by any Child
     * MetaContext for purpose of creation new context and it needs info what was already pushed
     * onto the stack.
     *
     * @return {?}
     */
    function () {
        return this.env.peak(ACTIVE_CNTX);
    };
    /**
     * Let's clean up and destroy pushed context
     */
    /**
     * Let's clean up and destroy pushed context
     * @return {?}
     */
    MetaContextComponent.prototype.ngOnDestroy = /**
     * Let's clean up and destroy pushed context
     * @return {?}
     */
    function () {
        if (this.env.hasValue('parent-cnx')) {
            this.env.deleteValue('parent-cnx');
        }
    };
    /**
     * Ideally we do not need this method if Angular would support to pass variable number of
     * bindings without a need to have backup property for each of the bindings or expression./
     *
     * Once they support. we can remove this. Since this check what are known bindings passed,
     * meaning the ones decorated with \@Input and the rest
     *
     * @return {?}
     */
    MetaContextComponent.prototype.initBindings = /**
     * Ideally we do not need this method if Angular would support to pass variable number of
     * bindings without a need to have backup property for each of the bindings or expression./
     *
     * Once they support. we can remove this. Since this check what are known bindings passed,
     * meaning the ones decorated with \@Input and the rest
     *
     * @return {?}
     */
    function () {
        var _this = this;
        this.bindingsMap = new Map();
        var /** @type {?} */ nativeElement = this.elementRef.nativeElement;
        this.initImplicitBindings();
        for (var /** @type {?} */ i = 0; i < nativeElement.attributes.length; i++) {
            var /** @type {?} */ attr = nativeElement.attributes.item(i);
            if (this.ignoreBinding(attr)) {
                continue;
            }
            if (isPresent(attr.name) && attr.name.toLowerCase() === 'scopekey') {
                this._scopeBinding = attr.value;
            }
            else {
                this.bindingsMap.set(attr.name, attr.value);
            }
        }
        this.bindingKeys = [];
        this.bindingsMap.forEach(function (value, key) {
            _this.bindingKeys.push(key);
        });
        // Sort them by their importance or rank
        ListWrapper.sortByExample(this.bindingKeys, IMPLICIT_PROPERTIES);
    };
    /**
     * The thing we want is to pass variable number of bindings and resolve them programmatically.
     * Currently in Angular we cannot do this we have these set of properties where we expect
     * some expression, some dynamic properties. For the rest we expect only string literal to be
     * passed in therefore we can resolve them with nativeElement.attributes
     *
     * @return {?}
     */
    MetaContextComponent.prototype.initImplicitBindings = /**
     * The thing we want is to pass variable number of bindings and resolve them programmatically.
     * Currently in Angular we cannot do this we have these set of properties where we expect
     * some expression, some dynamic properties. For the rest we expect only string literal to be
     * passed in therefore we can resolve them with nativeElement.attributes
     *
     * @return {?}
     */
    function () {
        if (isPresent(this.module)) {
            this.bindingsMap.set('module', this.module);
        }
        if (isPresent(this.layout)) {
            this.bindingsMap.set('layout', this.layout);
        }
        if (isPresent(this.operation)) {
            this.bindingsMap.set('operation', this.operation);
        }
        if (isPresent(this.class)) {
            this.bindingsMap.set('class', this.class);
        }
        if (isPresent(this.object)) {
            this.bindingsMap.set('object', this.object);
            this.prevObject = Object.assign({}, this.object);
        }
        if (isPresent(this.actionCategory)) {
            this.bindingsMap.set('actionCategory', this.actionCategory);
        }
        if (isPresent(this.action)) {
            this.bindingsMap.set('action', this.action);
        }
        if (isPresent(this.field)) {
            this.bindingsMap.set('field', this.field);
        }
    };
    /**
     *
     * Since we are going thru the element' attributes we want to skip anything that has nothign
     * to do with us.
     *
     * @param {?} attr
     * @return {?}
     */
    MetaContextComponent.prototype.ignoreBinding = /**
     *
     * Since we are going thru the element' attributes we want to skip anything that has nothign
     * to do with us.
     *
     * @param {?} attr
     * @return {?}
     */
    function (attr) {
        return IMPLICIT_PROPERTIES.indexOf(attr.name) !== -1 ||
            StringWrapper.contains(attr.name, '_ng') ||
            StringWrapper.contains(attr.name, 'ng-') ||
            StringWrapper.contains(attr.name, '(') ||
            (isBlank(attr.value) || attr.value.length === 0);
    };
    /**
     * If object is changed we need to also update our angular model to reflect user changes. All
     * changes and updates in metaui use object references
     * @return {?}
     */
    MetaContextComponent.prototype.updateModel = /**
     * If object is changed we need to also update our angular model to reflect user changes. All
     * changes and updates in metaui use object references
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ fields = Object.keys(this.object);
        fields.forEach(function (field) {
            var /** @type {?} */ control = /** @type {?} */ (_this.formGroup.get(field));
            if (isPresent(control)) {
                control.patchValue(_this.object[field], { onlySelf: false, emitEvent: true });
            }
        });
        this.prevObject = Object.assign({}, this.object);
    };
    /**
     * @return {?}
     */
    MetaContextComponent.prototype._hasObject = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ context = this.activeContext();
        if (isPresent(context)) {
            return isPresent((/** @type {?} */ (context)).object);
        }
        return false;
    };
    MetaContextComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-context',
                    template: '<ng-content></ng-content>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        { provide: BaseFormComponent, useExisting: forwardRef(function () { return MetaContextComponent; }) }
                    ]
                },] },
    ];
    /** @nocollapse */
    MetaContextComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Environment },
        { type: BaseFormComponent, decorators: [{ type: SkipSelf }, { type: Optional }, { type: Inject, args: [forwardRef(function () { return BaseFormComponent; }),] }] }
    ]; };
    MetaContextComponent.propDecorators = {
        module: [{ type: Input }],
        layout: [{ type: Input }],
        operation: [{ type: Input }],
        class: [{ type: Input }],
        object: [{ type: Input }],
        actionCategory: [{ type: Input }],
        action: [{ type: Input }],
        field: [{ type: Input }],
        pushNewContext: [{ type: Input }],
        beforeContextSet: [{ type: Output }],
        onContextChanged: [{ type: Output }],
        afterContextSet: [{ type: Output }],
        onAction: [{ type: Output }]
    };
    return MetaContextComponent;
}(BaseFormComponent));
/**
 *
 * Defines format for the broadcasted action event. MetaUI can also execute actions which needs to
 * be handled by application or actual component using this m-context.
 *
 */
var  /**
 *
 * Defines format for the broadcasted action event. MetaUI can also execute actions which needs to
 * be handled by application or actual component using this m-context.
 *
 */
MetaUIActionEvent = /** @class */ (function () {
    function MetaUIActionEvent(component, eventName, cnxName, data) {
        this.component = component;
        this.eventName = eventName;
        this.cnxName = cnxName;
        this.data = data;
    }
    return MetaUIActionEvent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AWMetaCoreModule = /** @class */ (function () {
    function AWMetaCoreModule() {
    }
    AWMetaCoreModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MetaContextComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule
                    ],
                    entryComponents: [
                        MetaContextComponent
                    ],
                    exports: [
                        MetaContextComponent,
                        ReactiveFormsModule,
                        FormsModule
                    ],
                    providers: []
                },] },
    ];
    return AWMetaCoreModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var RuleLoaderService = /** @class */ (function () {
    function RuleLoaderService() {
    }
    Object.defineProperty(RuleLoaderService.prototype, "uiMeta", {
        get: /**
         * @return {?}
         */
        function () {
            return this._uiMeta;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._uiMeta = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} meta
     * @param {?} source
     * @param {?} module
     * @param {?} onRule
     * @return {?}
     */
    RuleLoaderService.prototype.loadRules = /**
     * @param {?} meta
     * @param {?} source
     * @param {?} module
     * @param {?} onRule
     * @return {?}
     */
    function (meta, source, module, onRule) {
        var _this = this;
        this._uiMeta = /** @type {?} */ (meta);
        source.forEach(function (val, index) {
            var /** @type {?} */ rule = _this.readRule(val, module);
            if (isPresent(onRule)) {
                onRule(rule);
            }
        });
    };
    /**
     * @param {?} source
     * @param {?} module
     * @return {?}
     */
    RuleLoaderService.prototype.loadRulesWithReturn = /**
     * @param {?} source
     * @param {?} module
     * @return {?}
     */
    function (source, module) {
        var _this = this;
        var /** @type {?} */ rules = new Array();
        source.forEach(function (val, index) {
            var /** @type {?} */ rule = _this.readRule(val, module);
            rules.push(rule);
        });
        return rules;
    };
    /**
     * @param {?} jsonRule
     * @param {?} module
     * @return {?}
     */
    RuleLoaderService.prototype.readRule = /**
     * @param {?} jsonRule
     * @param {?} module
     * @return {?}
     */
    function (jsonRule, module) {
        var _this = this;
        var /** @type {?} */ selectors = new Array();
        try {
            for (var _a = __values(jsonRule._selectors), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                if (isPresent(item._value) && item._value.constructor === Object && Object.keys(item._value).length === 0) {
                    item._value = Meta.NullMarker;
                }
                var /** @type {?} */ selector = new Selector(item._key, item._value, item._isDecl);
                selectors.push(selector);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var /** @type {?} */ properties = MapWrapper.createFromStringMapWithResolve(jsonRule._properties, function (k, v) {
            if (isStringMap(v) &&
                isPresent(v['t'])) {
                return _this.resoveValue(v['t'], v, module);
            }
            else if (isStringMap(v) && !isArray(v)) {
                // we have some
                // other sub level
                // of object
                // literal - lets
                // convert this
                // into Map.
                return MapWrapper.createFromStringMapWithResolve(v, function (key, val) {
                    return _this.resoveValue(val['t'], val, module);
                });
            }
            else if (isArray(v)) {
                // let convert with
                // typings as well
                return ListWrapper.clone(v);
            }
            return v;
        });
        var /** @type {?} */ props = properties.size === 0 ? undefined : properties;
        var /** @type {?} */ rule = new Rule(selectors, props, jsonRule._rank);
        return rule;
        var e_1, _c;
    };
    /**
     * @param {?} type
     * @param {?} value
     * @param {?} module
     * @return {?}
     */
    RuleLoaderService.prototype.resoveValue = /**
     * @param {?} type
     * @param {?} value
     * @param {?} module
     * @return {?}
     */
    function (type, value, module) {
        if (isBlank(value)) {
            return null;
        }
        if (type === 'Expr') {
            return new Expr(value['v']);
        }
        else if (type === 'SDW') {
            var /** @type {?} */ expr = new Expr(value['v']);
            return new StaticDynamicWrapper(new StaticallyResolvableWrapper(expr));
        }
        else if (type === 'CFP') {
            return new ContextFieldPath(value['v']);
        }
        else if (type === 'OV') {
            return new OverrideValue(value['v']);
        }
        else if (type === 'i18n' && value['v']['key']) {
            var /** @type {?} */ locKey = value['v']['key'];
            return isPresent(this._uiMeta) ? this._uiMeta.createLocalizedString(locKey, value['v']['defVal'])
                :
                    new LocalizedString(null, module, locKey, value['v']['defVal']);
        }
        return value;
    };
    RuleLoaderService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    RuleLoaderService.ctorParameters = function () { return []; };
    return RuleLoaderService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NoMetaComponent = /** @class */ (function () {
    function NoMetaComponent() {
    }
    /**
     * @return {?}
     */
    NoMetaComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NoMetaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-no-meta',
                    template: "\n        <h2>MetaIncludeComponentDirective Error:</h2>\n                No componentName property resolved in Context<br/>\n    ",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    NoMetaComponent.ctorParameters = function () { return []; };
    return NoMetaComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  MetaIncludeComponentDirective is (along with MetaContext) the key element for binding MetaUI
 * into AngularJs user interfaces. You can think of it such GLUE.
 *
 *  MetaIncludeComponentDirective dynamically switches in a Angular's component based on the
 * current MetaContext's
 * 'component' property and sets its bindings from the 'bindings' property.  This alone enables
 * almost any existing Angular's widget to be specified for use for a particular field or layout
 * using rules -- without any additional glue code .
 *
 *  component using 'wrapperComponent' and 'wrapperBindings', binding component content using the
 * bindings 'ngcontent', ngcontentLayout and 'ngcontentelElement', and event binding named Content
 * templates using an
 * 'awcontentLayouts' map binding. Without this we will not be able to use complex layouts.
 *
 */
var MetaIncludeComponentDirective = /** @class */ (function (_super) {
    __extends(MetaIncludeComponentDirective, _super);
    function MetaIncludeComponentDirective(metaContext, viewContainer, factoryResolver, env, cd, compRegistry, domUtils) {
        var _this = _super.call(this, viewContainer, factoryResolver, cd, compRegistry) || this;
        _this.metaContext = metaContext;
        _this.viewContainer = viewContainer;
        _this.factoryResolver = factoryResolver;
        _this.env = env;
        _this.cd = cd;
        _this.compRegistry = compRegistry;
        _this.domUtils = domUtils;
        return _this;
    }
    /**
     * First we simply render the a component in the ngOnInit() and then every time something
     * changes.
     */
    /**
     * First we simply render the a component in the ngOnInit() and then every time something
     * changes.
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.ngDoCheck = /**
     * First we simply render the a component in the ngOnInit() and then every time something
     * changes.
     * @return {?}
     */
    function () {
        // console.log('MetaInclude(ngDoCheck):', this.name);
        var /** @type {?} */ context = this.metaContext.myContext();
        if (isBlank(context) || isBlank(this.currentComponent)) {
            // console.log('No context/ component for ' + this.name);
            return;
        }
        var /** @type {?} */ newComponent = context.propertyForKey('component');
        if (isPresent(newComponent) && isPresent(this.name) && (this.name !== newComponent)) {
            this.viewContainer.clear();
            this.doRenderComponent();
            // console.log('MetaInclude(ngDoCheck- rerender ):', this.name);
            this.createWrapperElementIfAny();
            this.createContentElementIfAny();
        }
        else {
            // we might not skip component instantiation but we still need to update bindings
            // as properties could change
            var /** @type {?} */ editable = context.propertyForKey(ObjectMeta.KeyEditable);
            if (isBlank(editable)) {
                editable = context.propertyForKey(UIMeta.KeyEditing);
            }
            var /** @type {?} */ metaBindings = context.propertyForKey(UIMeta.KeyBindings);
            var /** @type {?} */ type = context.propertyForKey(ObjectMeta.KeyType);
            var /** @type {?} */ inputs = this.componentReference().metadata.inputs;
            // re-apply Inputs
            // maybe we should diff properties and only if they changed re-apply
            if (isPresent(metaBindings) && isPresent(inputs)) {
                this.applyInputs(this.currentComponent, type, metaBindings, inputs, editable);
            }
        }
    };
    /*
     * Retrieves component Name from the Context.
     */
    /**
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.resolveComponentType = /**
     * @return {?}
     */
    function () {
        this.name = this.metaContext.myContext().propertyForKey(UIMeta.KeyComponentName);
        if (isBlank(this.name)) {
            return NoMetaComponent;
        }
        return _super.prototype.resolveComponentType.call(this);
    };
    /*
     * If there is a NG content as part of the bindings apply it and remove it from the list. In
     * the MetaUI world it can appear if we want to insert a text content into the element:
     *
     *
     *  trait=toManyLink {
     *         component:AWHyperlink;
     *         bindings: {
     *             action: ${
     *                this.set("object", value);
     *                this.set("actionCategory", "General");
     *                this.set("action", "Inspect");
     *                 meta.fireAction(this, true)
     *             };
     *             awcontent: "Click Me";
     *         }
     *     }
     *
     *
     */
    /**
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.ngContent = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ cntValue;
        var /** @type {?} */ bindings = this.metaContext.myContext().propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings) &&
            isPresent(cntValue = bindings.get(IncludeComponentDirective.NgContent))) {
            cntValue = isString(cntValue) ? cntValue :
                this.metaContext.myContext().resolveValue(cntValue);
        }
        return cntValue;
    };
    /**
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.ngContentElement = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ cntValue;
        var /** @type {?} */ bindings = this.metaContext.myContext().propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings) &&
            isPresent(cntValue = bindings.get(IncludeComponentDirective.NgContentElement))) {
            cntValue = isString(cntValue) ? cntValue :
                this.metaContext.myContext().resolveValue(cntValue);
        }
        return cntValue;
    };
    /**
     * Implement custom behavior of adding ngcontentLayout described above (where the constant
     * is defined)
     *
     */
    /**
     * Implement custom behavior of adding ngcontentLayout described above (where the constant
     * is defined)
     *
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.createContentElementIfAny = /**
     * Implement custom behavior of adding ngcontentLayout described above (where the constant
     * is defined)
     *
     * @return {?}
     */
    function () {
        var /** @type {?} */ detectChanges = false;
        var /** @type {?} */ bindings = this.metaContext.myContext().propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings) && bindings.has(MetaIncludeComponentDirective.NgContentLayout)) {
            var /** @type {?} */ layoutName = bindings.get(MetaIncludeComponentDirective.NgContentLayout);
            var /** @type {?} */ context = this.metaContext.myContext();
            context.push();
            context.set(UIMeta.KeyLayout, layoutName);
            var /** @type {?} */ componentName = context.propertyForKey('component');
            var /** @type {?} */ compType = this.compRegistry.nameToType.get(componentName);
            var /** @type {?} */ componentFactory = this.factoryResolver
                .resolveComponentFactory(compType);
            var /** @type {?} */ componentMeta = this.resolveDirective(componentFactory);
            var /** @type {?} */ ngComponent = this.viewContainer.createComponent(componentFactory, 0);
            var /** @type {?} */ cReference = {
                metadata: componentMeta,
                resolvedCompFactory: componentFactory,
                componentType: compType,
                componentName: componentName
            };
            this.applyBindings(cReference, ngComponent, context.propertyForKey(UIMeta.KeyBindings), false);
            this.domUtils.insertIntoParentNgContent(this.currentComponent.location.nativeElement, ngComponent.location.nativeElement);
            context.pop();
            detectChanges = true;
        }
        else {
            detectChanges = _super.prototype.createContentElementIfAny.call(this);
        }
        if (detectChanges) {
            // console.log('MetaInclude(createContentElementIfAny):', this.name);
            this.cd.detectChanges();
        }
        return detectChanges;
    };
    /**
     * Meta placeTheComponent needs to account for wrapper component. If wrapper component
     * is present. It needs to inject the wrapper component on the page and add this component
     * inside the wrapper component.
     */
    /**
     * Meta placeTheComponent needs to account for wrapper component. If wrapper component
     * is present. It needs to inject the wrapper component on the page and add this component
     * inside the wrapper component.
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.createWrapperElementIfAny = /**
     * Meta placeTheComponent needs to account for wrapper component. If wrapper component
     * is present. It needs to inject the wrapper component on the page and add this component
     * inside the wrapper component.
     * @return {?}
     */
    function () {
        var /** @type {?} */ wrapperName = this.metaContext.myContext().propertyForKey(UIMeta.KeyWrapperComponent);
        if (isBlank(wrapperName)) {
            return;
        }
        // Now we have wrapperComponent. We do the following:
        // 1.  Create wrapper component.
        var /** @type {?} */ wrapperType = this.compRegistry.nameToType.get(wrapperName);
        var /** @type {?} */ componentFactory = this.factoryResolver
            .resolveComponentFactory(wrapperType);
        var /** @type {?} */ componentMeta = this.resolveDirective(wrapperType);
        var /** @type {?} */ wrapperComponent = this.viewContainer.createComponent(componentFactory);
        // 2. Add wrapper bindings to wrapper component.
        var /** @type {?} */ wrapperBindings = this.metaContext.myContext().propertyForKey(UIMeta.KeyWrapperBinding);
        (/** @type {?} */ (wrapperComponent.instance))['bindings'] = wrapperBindings;
        // 3. Apply the bindings. Get the wrapper metadata, look through it's input - output
        // bindings. and apply the wrapperBindings to these bindings.
        var /** @type {?} */ wrapperComponentRef = {
            metadata: componentMeta,
            resolvedCompFactory: componentFactory,
            componentType: wrapperType,
            componentName: wrapperName
        };
        this.applyBindings(wrapperComponentRef, wrapperComponent, wrapperBindings);
        this.domUtils.insertIntoParentNgContent(wrapperComponent.location.nativeElement, this.currentComponent.location.nativeElement);
    };
    /**
     * ApplyBindings reads the @Inputs from ComponentMetadata and check if there exists a binding
     * coming from MetaRules. If there is we assign it to the input.
     */
    /**
     * ApplyBindings reads the \@Inputs from ComponentMetadata and check if there exists a binding
     * coming from MetaRules. If there is we assign it to the input.
     * @param {?} cRef
     * @param {?} component
     * @param {?} bindings
     * @param {?=} bUseMetaBindings
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.applyBindings = /**
     * ApplyBindings reads the \@Inputs from ComponentMetadata and check if there exists a binding
     * coming from MetaRules. If there is we assign it to the input.
     * @param {?} cRef
     * @param {?} component
     * @param {?} bindings
     * @param {?=} bUseMetaBindings
     * @return {?}
     */
    function (cRef, component, bindings, bUseMetaBindings) {
        if (bUseMetaBindings === void 0) { bUseMetaBindings = true; }
        _super.prototype.applyBindings.call(this, cRef, component, bindings);
        var /** @type {?} */ inputs = cRef.metadata.inputs;
        var /** @type {?} */ outputs = cRef.metadata.outputs;
        var /** @type {?} */ metaBindings = this.metaContext.myContext().propertyForKey(UIMeta.KeyBindings);
        var /** @type {?} */ editable = this.metaContext.myContext().propertyForKey(ObjectMeta.KeyEditable);
        var /** @type {?} */ type = this.metaContext.myContext().propertyForKey(ObjectMeta.KeyType);
        // There are cases where we want to use the bindings passed into this function.
        // For example, the wrapperBindings.
        if (!bUseMetaBindings) {
            metaBindings = bindings;
        }
        if (isBlank(metaBindings) || isBlank(inputs)) {
            return;
        }
        var /** @type {?} */ currenBindings = MapWrapper.clone(metaBindings);
        this.applyInputs(component, type, currenBindings, inputs, editable);
        this.applyOutputs(component, currenBindings, outputs);
    };
    /**
     * @param {?} component
     * @param {?} type
     * @param {?} bindings
     * @param {?} inputs
     * @param {?} editable
     * @param {?=} compToBeRendered
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.applyInputs = /**
     * @param {?} component
     * @param {?} type
     * @param {?} bindings
     * @param {?} inputs
     * @param {?} editable
     * @param {?=} compToBeRendered
     * @return {?}
     */
    function (component, type, bindings, inputs, editable, compToBeRendered) {
        if (compToBeRendered === void 0) { compToBeRendered = true; }
        // propagate a field type to bindings.
        if (isPresent(type) && isPresent(component.instance.canSetType) &&
            component.instance.canSetType()) {
            bindings.set(ObjectMeta.KeyType, type);
        }
        if (isPresent(editable) && isPresent(component.instance['editable'])) {
            component.instance['editable'] = editable;
        }
        try {
            for (var inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next(); !inputs_1_1.done; inputs_1_1 = inputs_1.next()) {
                var key = inputs_1_1.value;
                var /** @type {?} */ publicKey = nonPrivatePrefix(key);
                var /** @type {?} */ value = bindings.get(publicKey);
                // Handle special case where we do not pass explicitly or inherit from parent @Input
                // name for the component
                if (key === 'name' && isBlank(value)) {
                    value = this.metaContext.myContext().propertyForKey(ObjectMeta.KeyField);
                }
                if (this.skipInput(key, value)) {
                    continue;
                }
                // compToBeRendered = only first time
                if (compToBeRendered && value instanceof ContextFieldPath) {
                    this.applyDynamicInputBindings(component.instance, bindings, inputs, key, value, editable);
                }
                else if (compToBeRendered && value instanceof DynamicPropertyValue) {
                    var /** @type {?} */ dynval = value;
                    var /** @type {?} */ newValue = dynval.evaluate(this.metaContext.myContext());
                    component.instance[publicKey] = newValue;
                }
                else {
                    /**
                                     * when re-applying Inputs skip all expressions above and only work with regular
                                     * types
                                     *
                                     * set it only if it changes so it will not trigger necessary `value changed
                                     * aftter check`
                                     */
                    if (!equals(component.instance[publicKey], value)) {
                        component.instance[publicKey] = value;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1.return)) _a.call(inputs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // apply Formatter that can be specified in the oss
        // temporary disabled untill angular will support runtime i18n
        // if (bindings.has(MetaIncludeComponentDirective.FormatterBinding)) {
        //     let transform = this.formatters
        //         .get(bindings.get(MetaIncludeComponentDirective.FormatterBinding));
        //     component.instance[MetaIncludeComponentDirective.FormatterBinding] = transform;
        // }
        var e_1, _a;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.skipInput = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        return isBlank(value) || key === IncludeComponentDirective.NgContent ||
            key === MetaIncludeComponentDirective.NgContentLayout;
    };
    /**
     * @param {?} component
     * @param {?} bindings
     * @param {?} outputs
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.applyOutputs = /**
     * @param {?} component
     * @param {?} bindings
     * @param {?} outputs
     * @return {?}
     */
    function (component, bindings, outputs) {
        var _this = this;
        var _loop_1 = function (key) {
            var /** @type {?} */ publicKey = nonPrivatePrefix(key);
            var /** @type {?} */ value = bindings.get(publicKey);
            if (key === IncludeComponentDirective.NgContent) {
                return "continue";
            }
            var /** @type {?} */ eventEmitter = component.instance[publicKey];
            if (value instanceof DynamicPropertyValue) {
                this_1.applyDynamicOutputBinding(eventEmitter, value, this_1.metaContext.myContext());
            }
            else {
                // just trigger event outside
                eventEmitter.subscribe(function (val) {
                    if (_this.env.hasValue('parent-cnx')) {
                        var /** @type {?} */ event_1 = val;
                        var /** @type {?} */ cnx = _this.env.getValue('parent-cnx');
                        if (!(val instanceof MetaUIActionEvent)) {
                            event_1 = new MetaUIActionEvent(component.instance, publicKey, publicKey, val);
                        }
                        cnx.onAction.emit(event_1);
                    }
                });
            }
        };
        var this_1 = this;
        try {
            for (var outputs_1 = __values(outputs), outputs_1_1 = outputs_1.next(); !outputs_1_1.done; outputs_1_1 = outputs_1.next()) {
                var key = outputs_1_1.value;
                _loop_1(key);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (outputs_1_1 && !outputs_1_1.done && (_a = outputs_1.return)) _a.call(outputs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    };
    /**
     * @param {?} emitter
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.applyDynamicOutputBinding = /**
     * @param {?} emitter
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    function (emitter, value, context) {
        emitter.asObservable().subscribe(function (val) {
            var /** @type {?} */ dynval = value;
            context.resolveValue(dynval);
        });
    };
    /**
     * @param {?} me
     * @param {?} bindings
     * @param {?} inputs
     * @param {?} key
     * @param {?} value
     * @param {?} editable
     * @return {?}
     */
    MetaIncludeComponentDirective.prototype.applyDynamicInputBindings = /**
     * @param {?} me
     * @param {?} bindings
     * @param {?} inputs
     * @param {?} key
     * @param {?} value
     * @param {?} editable
     * @return {?}
     */
    function (me, bindings, inputs, key, value, editable) {
        var _this = this;
        var /** @type {?} */ publicKey = nonPrivatePrefix(key);
        var /** @type {?} */ cnxtPath = value;
        var /** @type {?} */ metaContext = this.metaContext;
        /**
                 * captured also current context snapshot so we can replay ContextFieldPath.evaluate() if
                 * called outside of push/pop cycle.
                 *
                 * todo: check if we can replace this with Custom value accessor
                 */
        Object.defineProperty(me, publicKey, {
            get: function () {
                var /** @type {?} */ context = _this.metaContext.myContext();
                return cnxtPath.evaluate(context);
            },
            set: function (val) {
                var /** @type {?} */ context = _this.metaContext.myContext();
                var /** @type {?} */ editing = context.propertyForKey(ObjectMeta.KeyEditable)
                    || context.propertyForKey(UIMeta.KeyEditing);
                if (editing && !StringWrapper.equals(val, me[publicKey])) {
                    var /** @type {?} */ type = context.propertyForKey(ObjectMeta.KeyType);
                    cnxtPath.evaluateSet(context, ValueConverter.value(type, val));
                }
            },
            enumerable: true,
            configurable: true
        });
    };
    /**
     * Just a constant use to access Environment where we store current context for current render
     * lifecycle
     *
     */
    MetaIncludeComponentDirective.FormatterBinding = 'formatter';
    /**
     *
     * In metaU we can also insert into the element not only ngcontent but new instantiated
     * component which is defined by layout
     *
     * ```
     * field trait=ObjectDetail {
     * 	editable=false {
     * 		component: HoverCardComponnet;
     * 		bindings: {
     * 			ngcontentLayout: Content;
     * 			linkTitle:${properties.get("label")};
     * 		}
     * 	}
     *
     * \@layout=Content {
     * 		component: MetaContextObject;
     * 		bindings: {
     * 			object: $value;
     * 			layout:DetailLayout
     * 			operation:"view";
     * 		}
     * 	}
     * }
     * ```
     *
     */
    MetaIncludeComponentDirective.NgContentLayout = 'ngcontentLayout';
    MetaIncludeComponentDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'm-include-component'
                },] },
    ];
    /** @nocollapse */
    MetaIncludeComponentDirective.ctorParameters = function () { return [
        { type: MetaContextComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return MetaContextComponent; }),] }] },
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver },
        { type: Environment },
        { type: ChangeDetectorRef },
        { type: ComponentRegistry },
        { type: DomUtilsService }
    ]; };
    MetaIncludeComponentDirective.propDecorators = {
        context: [{ type: Input }]
    };
    return MetaIncludeComponentDirective;
}(IncludeComponentDirective));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This is just a wrapper component around meta-form-table as we need every single context push to
 * happen before the child content start to render.
 *
 * In this case I would like to wrap wrap my content with m-context in the way:
 *
 *  <m-context scopeKey="class">
 *        <!-- lets process one zone now and four we can deal later-->
 *        <ng-template [ngIf]="isFiveZoneLayout">
 *              <aw-form-table [isEditable]="isEditable" [labelsOnTop]="labelsOnTop"
 * (onSubmit)="onSaveAction($event)">
 *                  <ng-template ngFor let-curentField [ngForOf]="zLeft()">
 *                      <m-context [field]="curentField">
 *                           <m-form-row [field]="curentField"></m-form-row>
 *                      </m-context>
 *                  </ng-template>
 *          </aw-form-table>
 *        </ng-template>
 *  </m-context>
 *
 *
 *
 */
var MetaFormComponent = /** @class */ (function () {
    function MetaFormComponent(environment) {
        this.environment = environment;
    }
    MetaFormComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-form',
                    template: "<m-context #cnx scopeKey=\"class\">\n    <!-- Dont try to render if the object is not set yet -->\n    <m-form-table *ngIf=\"cnx.hasObject\"></m-form-table>\n</m-context>\n",
                },] },
    ];
    /** @nocollapse */
    MetaFormComponent.ctorParameters = function () { return [
        { type: Environment }
    ]; };
    return MetaFormComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Common component to setup the context and also create context snapshot for later user.
 * @abstract
 */
var  /**
 * Common component to setup the context and also create context snapshot for later user.
 * @abstract
 */
MetaBaseComponent = /** @class */ (function (_super) {
    __extends(MetaBaseComponent, _super);
    function MetaBaseComponent(env, _metaContext) {
        var _this = _super.call(this, env, _metaContext) || this;
        _this.env = env;
        _this._metaContext = _metaContext;
        return _this;
    }
    /**
     * @return {?}
     */
    MetaBaseComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        this.updateMeta();
    };
    /**
     * @return {?}
     */
    MetaBaseComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        this.updateMeta();
    };
    /**
     * @return {?}
     */
    MetaBaseComponent.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    MetaBaseComponent.prototype.updateMeta = /**
     * @return {?}
     */
    function () {
        this.editing = this.context.booleanPropertyForKey(UIMeta.KeyEditing, false);
        if (this.editing) {
            this.object = this.context.values.get(ObjectMeta.KeyObject);
            this.contextSnapshot = this.context.snapshot();
        }
        this.doUpdate();
    };
    /**
     * Placeholder to be implemented by subclass. this method is triggered when we detect any
     * changes on the MetaContext
     */
    /**
     * Placeholder to be implemented by subclass. this method is triggered when we detect any
     * changes on the MetaContext
     * @return {?}
     */
    MetaBaseComponent.prototype.doUpdate = /**
     * Placeholder to be implemented by subclass. this method is triggered when we detect any
     * changes on the MetaContext
     * @return {?}
     */
    function () {
    };
    Object.defineProperty(MetaBaseComponent.prototype, "context", {
        /**
         * Get the last saved context from the MetaContext component
         *
         */
        get: /**
         * Get the last saved context from the MetaContext component
         *
         * @return {?}
         */
        function () {
            if (isPresent(this._metaContext) && isPresent(this._metaContext.myContext())) {
                return this._metaContext.myContext();
            }
            assert(false, 'Should always have metaContext available');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MetaBaseComponent.prototype.isNestedContext = /**
     * @return {?}
     */
    function () {
        return this.context.isNested;
    };
    // remove this ugly solution once I figure out custom value accessor that I can
    // provide as a expression
    /**
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    MetaBaseComponent.prototype.properties = /**
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    function (key, defValue) {
        if (defValue === void 0) { defValue = null; }
        return isPresent(this.context) ? this.context.propertyForKey(key) : defValue;
    };
    /**
     * Retrieves active context's properties
     *
     */
    /**
     * Retrieves active context's properties
     *
     * @param {?} me
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    MetaBaseComponent.prototype.aProperties = /**
     * Retrieves active context's properties
     *
     * @param {?} me
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    function (me, key, defValue) {
        if (defValue === void 0) { defValue = null; }
        var /** @type {?} */ activeContext = this._metaContext.activeContext();
        return isPresent(me) ? me.propertyForKey(key) : defValue;
    };
    return MetaBaseComponent;
}(BaseFormComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This is a wrapper around FormtTable to render data based on current MetaContext.
 */
var MetaFormTableComponent = /** @class */ (function (_super) {
    __extends(MetaFormTableComponent, _super);
    /**
     * Active zones passed to the FormTable.
     *
     * Note: I could not find better way without having this property. When using FormTable I dont
     * want to tell what zones are active. The form table should figure out byitself just from the
     * ng-contented sections.
     *
     * The other approach is the wrap these into component and probably better
     *
     *e.g.
     *
     * ```html
     *  <aw-form-table ...>
     *    <aw-form-zone name='top'>
     *        <aw-form-row>...</aw-form-row>
     *     <aw-form-zone>
     *
     *
     *    ...
     *  </aw-form-table ...>
     * ```
     *
     */
    function MetaFormTableComponent(_context, env) {
        var _this = _super.call(this, env, _context) || this;
        _this._context = _context;
        _this.env = env;
        return _this;
    }
    /**
     * @param {?} zone
     * @return {?}
     */
    MetaFormTableComponent.prototype.canShowZone = /**
     * @param {?} zone
     * @return {?}
     */
    function (zone) {
        return isPresent(this.fieldsByZone) && this.fieldsByZone.has(zone);
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.doUpdate = /**
     * @return {?}
     */
    function () {
        _super.prototype.doUpdate.call(this);
        this.fieldsByZone = this.context.propertyForKey(UIMeta.PropFieldsByZone);
        this.isFiveZoneLayout = this.context.propertyForKey(UIMeta.PropIsFieldsByZone);
        var /** @type {?} */ bindings = this.context.propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings)) {
            this.showLabelsAboveControls = bindings.get('showLabelsAboveControls');
            if (isBlank(this.showLabelsAboveControls)) {
                this.showLabelsAboveControls = false;
            }
        }
        this.initForm();
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.zLeft = /**
     * @return {?}
     */
    function () {
        return this.fieldsByZone.get(UIMeta.ZoneLeft);
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.zMiddle = /**
     * @return {?}
     */
    function () {
        return this.fieldsByZone.get(UIMeta.ZoneMiddle);
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.zRight = /**
     * @return {?}
     */
    function () {
        return this.fieldsByZone.get(UIMeta.ZoneRight);
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.zTop = /**
     * @return {?}
     */
    function () {
        return this.fieldsByZone.get(UIMeta.ZoneTop);
    };
    /**
     * @return {?}
     */
    MetaFormTableComponent.prototype.zBottom = /**
     * @return {?}
     */
    function () {
        return this.fieldsByZone.get(UIMeta.ZoneBottom);
    };
    /**
     * Need to initialize FormGroup with all the available fields based on the given object. Its
     * hard to manage a state where we dynamically render different number of fields per operation.
     *
     * *
     * @return {?}
     */
    MetaFormTableComponent.prototype.initForm = /**
     * Need to initialize FormGroup with all the available fields based on the given object. Its
     * hard to manage a state where we dynamically render different number of fields per operation.
     *
     * *
     * @return {?}
     */
    function () {
        var _this = this;
        if (isPresent(this.form)) {
            this.form.editable = this.editable;
        }
        var /** @type {?} */ obj = (/** @type {?} */ (this.context)).object;
        if (Object.keys(this.formGroup.value).length !== Object.keys(obj).length) {
            Object.keys(obj).forEach(function (key) {
                _this.doRegister(key, obj[key]);
            });
        }
    };
    MetaFormTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-form-table',
                    template: "<ng-template [ngIf]=\"isFiveZoneLayout\">\n\n    <aw-form-table #metaFormTable [editable]=\"editing\" [useFiveZone]=\"isFiveZoneLayout\"\n                   [omitPadding]=\"isNestedContext()\"\n                   [editabilityCheck]=\"false\"\n                   [labelsOnTop]=\"showLabelsAboveControls\">\n\n\n        <aw-top *ngIf=\"canShowZone('zTop')\">\n            <ng-template ngFor let-curentField [ngForOf]=\"zTop()\">\n                <m-context [field]=\"curentField\">\n                    <m-form-row [field]=\"curentField\" [editable]=\"editing\"\n                                [initialSize]=\"'x-large'\"></m-form-row>\n                </m-context>\n            </ng-template>\n        </aw-top>\n\n\n        <aw-left *ngIf=\"canShowZone('zLeft')\">\n\n            <ng-template ngFor let-curentField [ngForOf]=\"zLeft()\">\n                <m-context [field]=\"curentField\">\n                    <m-form-row [field]=\"curentField\" [editable]=\"editing\"></m-form-row>\n                </m-context>\n            </ng-template>\n        </aw-left>\n\n\n        <aw-middle *ngIf=\"canShowZone('zMiddle')\">\n            <ng-template ngFor let-curentField [ngForOf]=\"zMiddle()\">\n                <m-context [field]=\"curentField\">\n                    <m-form-row [field]=\"curentField\" [editable]=\"editing\"></m-form-row>\n                </m-context>\n            </ng-template>\n        </aw-middle>\n\n        <aw-right *ngIf=\"canShowZone('zRight')\">\n            <ng-template ngFor let-curentField [ngForOf]=\"zRight()\">\n                <m-context [field]=\"curentField\">\n                    <m-form-row [field]=\"curentField\" [editable]=\"editing\"></m-form-row>\n                </m-context>\n            </ng-template>\n        </aw-right>\n\n\n        <aw-bottom *ngIf=\"canShowZone('zBottom')\">\n            <ng-template ngFor let-curentField [ngForOf]=\"zBottom()\">\n                <m-context [field]=\"curentField\">\n                    <m-form-row [field]=\"curentField\" [editable]=\"editing\"\n                                [initialSize]=\"'x-large'\"></m-form-row>\n                </m-context>\n            </ng-template>\n        </aw-bottom>\n    </aw-form-table>\n</ng-template>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    MetaFormTableComponent.ctorParameters = function () { return [
        { type: MetaContextComponent, decorators: [{ type: Host }] },
        { type: Environment }
    ]; };
    MetaFormTableComponent.propDecorators = {
        form: [{ type: ViewChild, args: ['metaFormTable',] }]
    };
    return MetaFormTableComponent;
}(MetaBaseComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Component responsible for rendering a row using MetaIncludeComponent.
 * What I am still not sure, if I want to use fully validation from MetaRule and if I cannot
 * leverage basic validation from angular.
 *
 * Meaning I might remove default valid::** rule from WidgetsRules and when its required insert
 * default Required validation from angular.
 *
 */
var MetaFormRowComponent = /** @class */ (function (_super) {
    __extends(MetaFormRowComponent, _super);
    function MetaFormRowComponent(_metaContext, env) {
        var _this = _super.call(this, env, _metaContext) || this;
        _this._metaContext = _metaContext;
        _this.env = env;
        /**
         * There could be special cases when we are layout component that we want to extends the row
         * 100%.
         */
        _this.initialSize = 'medium';
        return _this;
    }
    /**
     * @return {?}
     */
    MetaFormRowComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        this.validators = this.createValidators();
    };
    /**
     * @param {?} key
     * @return {?}
     */
    MetaFormRowComponent.prototype.bindingBoolProperty = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ bindings = this.context.propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings) && bindings.has(key)) {
            var /** @type {?} */ value = bindings.get(key);
            return BooleanWrapper.boleanValue(value);
        }
        return false;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    MetaFormRowComponent.prototype.bindingStringProperty = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var /** @type {?} */ bindings = this.context.propertyForKey(UIMeta.KeyBindings);
        if (isPresent(bindings) && bindings.has(key)) {
            return bindings.get(key);
        }
        return null;
    };
    Object.defineProperty(MetaFormRowComponent.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ bindings = this.context.propertyForKey(UIMeta.KeyBindings);
            if (isPresent(bindings) && bindings.has('size')) {
                return bindings.get('size');
            }
            return this.initialSize;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.initialSize = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates angular based Validator which for a current field executes validation rules real
     * time as use type. At the bottom of the file there is example of async validator
     *
     * @return {?}
     */
    MetaFormRowComponent.prototype.createValidators = /**
     * Creates angular based Validator which for a current field executes validation rules real
     * time as use type. At the bottom of the file there is example of async validator
     *
     * @return {?}
     */
    function () {
        var /** @type {?} */ that = this;
        var /** @type {?} */ metaValidator = function (control) {
            if (isPresent(Validators.required(control)) || !control.touched) {
                return null;
            }
            var /** @type {?} */ errorMsg = UIMeta.validationError(that.context);
            return isPresent(errorMsg) ? {
                'metavalid': { 'msg': errorMsg }
            } : null;
        };
        return [metaValidator];
    };
    /**
     * @return {?}
     */
    MetaFormRowComponent.prototype.isRequired = /**
     * @return {?}
     */
    function () {
        return (isPresent(this.editing) && this.context.booleanPropertyForKey('required', false));
    };
    MetaFormRowComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-form-row',
                    template: "<aw-form-row\n    [editable]=\"editable\"\n    [customValidators]=\"validators\"\n    [size]=\"size\"\n    [hidden]=\"!properties('visible')\"\n    [styleClass]=\"bindingStringProperty('styleClass')\"\n    [name]=\"properties('field')\"\n    [required]=\"isRequired()\"\n    [label]=\"properties('label')\"\n    [noLabelLayout]=\"bindingBoolProperty('useNoLabelLayout')\">\n\n    <m-include-component></m-include-component>\n</aw-form-row>\n\n",
                    styles: [""],
                    providers: [
                        { provide: FormRowComponent, useExisting: forwardRef(function () { return MetaFormRowComponent; }) }
                    ]
                },] },
    ];
    /** @nocollapse */
    MetaFormRowComponent.ctorParameters = function () { return [
        { type: MetaContextComponent, decorators: [{ type: Host }] },
        { type: Environment }
    ]; };
    MetaFormRowComponent.propDecorators = {
        field: [{ type: Input }],
        initialSize: [{ type: Input }]
    };
    return MetaFormRowComponent;
}(MetaBaseComponent));
/*

 return new Promise((resolve) => {
 setTimeout (()=>{

 let context: UIContext = <UIContext> this._contextSnapshot.hydrate();
 context.value = control.value;

 let errorMsg = UIMeta.validationError(context);


 if(isPresent(errorMsg)) {
 resolve({metavalid: {msg: errorMsg}});
 } else{
 resolve(null);
 }

 }, 700);
 });


 */
// metaValid (): AsyncValidatorFn[]
// {
//     let metaValidator = (control: AbstractControl): {[key: string]: any} =>
//     {
//         return new Promise((resolve) =>
//         {
//             setTimeout(()=>
//             {
//                 let context: UIContext = <UIContext> this._contextSnapshot.hydrate();
//                 context.value = control.value;
//
//                 let errorMsg = UIMeta.validationError(context);
//
//
//                 if (isPresent(errorMsg)) {
//                     resolve({metavalid: {msg: errorMsg}});
//                 } else {
//                     resolve(null);
//                 }
//
//             } , 400);
//         });
//     };
//     return [metaValidator];
// }

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MetaContentPage  component is used from MetaRules and universal component rendering different
 * operation modes.
 *
 *
 */
var MetaContentPageComponent = /** @class */ (function () {
    function MetaContentPageComponent(route, routingService) {
        this.route = route;
        this.routingService = routingService;
        this.newContext = true;
        this.isInspectAction = false;
        this.okLabel = 'Back';
    }
    /**
     * @return {?}
     */
    MetaContentPageComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.layout = this.route.snapshot.params['layout'];
        this.operation = this.route.snapshot.params['operation'];
        var /** @type {?} */ url = '/' + this.route.snapshot.url[0].toString();
        if (this.routingService.stateCacheHistory.has(url)) {
            this.object = this.routingService.stateCacheHistory.get(url);
            this.objectName = UIMeta.defaultLabelForIdentifier(this.object.constructor.name);
        }
        var /** @type {?} */ withBackAction = this.route.snapshot.params['b'];
        if (isPresent(withBackAction) && BooleanWrapper.isTrue(withBackAction)) {
            this.isInspectAction = true;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MetaContentPageComponent.prototype.onBack = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.routingService.goBack();
    };
    MetaContentPageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-content-page',
                    template: "<!-- TODO: impplement dynamic title based on the operation and object as well as updates buttons-->\n\n<m-context [pushNewContext]=\"newContext\" [object]=\"object\" [operation]=\"operation\"\n           [layout]=\"layout\">\n\n    <aw-basic-navigator (onOKAction)=\"onBack($event)\" [okActionLabel]=\"okLabel\"\n                        [showCancelButton]=\"!isInspectAction\">\n\n\n        <div class=\"page-container \">\n            <br/>\n            <h3>{{objectName}} details:</h3>\n\n            <m-include-component></m-include-component>\n        </div>\n    </aw-basic-navigator>\n\n</m-context>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    MetaContentPageComponent.ctorParameters = function () { return [
        { type: ActivatedRoute },
        { type: RoutingService }
    ]; };
    return MetaContentPageComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MetaLayout represent a high level rule that aggregates defined layout. When we iterate thru the
 * different layout we need to remember both current rendered context as well as ItemProperties.
 *
 *
 *
 */
var  /**
 * MetaLayout represent a high level rule that aggregates defined layout. When we iterate thru the
 * different layout we need to remember both current rendered context as well as ItemProperties.
 *
 *
 *
 */
MetaLayout = /** @class */ (function (_super) {
    __extends(MetaLayout, _super);
    function MetaLayout(_metaContext, env) {
        var _this = _super.call(this, env, _metaContext) || this;
        _this._metaContext = _metaContext;
        _this.env = env;
        /**
         * Layout definitions by its name
         *
         */
        _this.nameToLayout = new Map();
        /**
         * A map linking the name of the layout to the actual context. We need this when we need
         * to access current content.
         *
         */
        _this.contextMap = new Map();
        return _this;
    }
    /**
     * Can be called by m-content to @Output when context properties are pushed to stack
     *
     */
    /**
     * Can be called by m-content to \@Output when context properties are pushed to stack
     *
     * @param {?} layoutName
     * @return {?}
     */
    MetaLayout.prototype.afterContextSet = /**
     * Can be called by m-content to \@Output when context properties are pushed to stack
     *
     * @param {?} layoutName
     * @return {?}
     */
    function (layoutName) {
        this.layoutContext = this.activeContext;
        this.contextMap.set(layoutName, this.layoutContext.snapshot().hydrate(false));
    };
    /**
     * Can be called by m-content to @Output after context properties are pushed to stack
     *
     */
    /**
     * Can be called by m-content to \@Output after context properties are pushed to stack
     *
     * @param {?} layoutName
     * @return {?}
     */
    MetaLayout.prototype.beforeContextSet = /**
     * Can be called by m-content to \@Output after context properties are pushed to stack
     *
     * @param {?} layoutName
     * @return {?}
     */
    function (layoutName) {
        this.layout = this.nameToLayout.get(layoutName);
    };
    Object.defineProperty(MetaLayout.prototype, "activeContext", {
        get: /**
         * @return {?}
         */
        function () {
            return this._metaContext.activeContext();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetaLayout.prototype, "allLayouts", {
        /**
         * Retrieves all available and active layouts for zones defined by subclasses
         *
         */
        get: /**
         * Retrieves all available and active layouts for zones defined by subclasses
         *
         * @return {?}
         */
        function () {
            var _this = this;
            if (isBlank(this._allLayouts)) {
                var /** @type {?} */ meta = /** @type {?} */ (this.activeContext.meta);
                this._allLayouts = meta.itemList(this.activeContext, UIMeta.KeyLayout, this.zones());
                this.nameToLayout.clear();
                this._allLayouts.forEach(function (item) {
                    return _this.nameToLayout.set(item.name, item);
                });
            }
            return this._allLayouts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetaLayout.prototype, "layoutsByZones", {
        /**
         * Retrieves all available and active layouts and aggregate them their name
         *
         */
        get: /**
         * Retrieves all available and active layouts and aggregate them their name
         *
         * @return {?}
         */
        function () {
            if (isBlank(this._layoutsByZones)) {
                var /** @type {?} */ meta = /** @type {?} */ (this.activeContext.meta);
                this._layoutsByZones = meta.itemsByZones(this.activeContext, UIMeta.KeyLayout, this.zones());
            }
            return this._layoutsByZones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetaLayout.prototype, "layout", {
        get: /**
         * @return {?}
         */
        function () {
            return this._layout;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._layout = value;
            this._propertyMap = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetaLayout.prototype, "propertyMap", {
        // todo: should this be for current layout?
        get: /**
         * @return {?}
         */
        function () {
            if (isBlank(this._propertyMap)) {
                this.activeContext.push();
                this._propertyMap = this.activeContext.allProperties();
                this.activeContext.pop();
            }
            return this._propertyMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MetaLayout.prototype.label = /**
     * @return {?}
     */
    function () {
        return this.activeContext.resolveValue(this.propertyMap.get(UIMeta.KeyLabel));
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MetaLayout.prototype.labelForContext = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ context = this.contextMap.get(name);
        return _super.prototype.aProperties.call(this, context, UIMeta.KeyLabel);
    };
    /**
     * @return {?}
     */
    MetaLayout.prototype.zones = /**
     * @return {?}
     */
    function () {
        return UIMeta.ZonesTLRMB;
    };
    // remove this ugly solution once I figure out custom value accessor
    /**
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    MetaLayout.prototype.properties = /**
     * @param {?} key
     * @param {?=} defValue
     * @return {?}
     */
    function (key, defValue) {
        if (defValue === void 0) { defValue = null; }
        return isPresent(this.activeContext) ? this.activeContext.propertyForKey(key) : defValue;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MetaLayout.prototype.debugString = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ context = this.contextMap.get(name);
        assert(isPresent(context), 'Trying to retrive debugString on non-existing context');
        return context.debugString();
    };
    /**
     * @return {?}
     */
    MetaLayout.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.layoutContext = null;
        this.contextMap.clear();
        this.contextMap = null;
    };
    return MetaLayout;
}(MetaBaseComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MetaElementList is implementation of Stack Layout where the content is rendered as list (stacked)
 * You do not use this layout directly as it is instantiated dynamically using MetaIncludeComponent.
 *
 * For more detail please checkout WidgetRules.oss the part bellow where create new trait
 * that can be applied to any layout.
 *
 * ```
 *
 * layout {
 *
 * \@trait=Stack { visible:true; component:MetaElementListComponent }
 *
 * }
 *
 * ```
 *
 * Actual usage could be :
 *
 *
 * ```
 *  layout=Inspect2#Stack {
 * \@layout=First#Form {
 *           elementStyle:"padding-bottom:100px";
 *       }
 * \@layout=Second#Form { zonePath:Second; }
 *   }
 *
 *
 *
 *    class=User {
 *       zNone => *;
 *       zLeft => firstName => lastName => age => department;
 *       Second.zLeft => email;
 *
 *   }
 *
 * ```
 *
 */
var MetaElementListComponent = /** @class */ (function (_super) {
    __extends(MetaElementListComponent, _super);
    function MetaElementListComponent(_metaContext, env, sanitizer) {
        var _this = _super.call(this, _metaContext, env) || this;
        _this._metaContext = _metaContext;
        _this.env = env;
        _this.sanitizer = sanitizer;
        return _this;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    MetaElementListComponent.prototype.styleString = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ lContext = this.contextMap.get(name);
        // return isPresent(lContext) && isPresent(lContext.propertyForKey('elementStyle')) ?
        //     this.sanitizer.bypassSecurityTrustStyle(lContext.propertyForKey('elementStyle')) :
        // null;
        return null;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MetaElementListComponent.prototype.classString = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ lContext = this.contextMap.get(name);
        return isPresent(lContext) ? lContext.propertyForKey('elementClass') : null;
    };
    MetaElementListComponent.decorators = [
        { type: Component, args: [{
                    template: "<!--<b>MetaElementList: {{allLayouts}} </b>-->\n<!--<pre [innerHTML]=\"context.debugString()\"></pre>-->\n\n<ng-template ngFor [ngForOf]=\"allLayouts\" let-cLayout>\n\n    <m-context [layout]=\"cLayout.name\" (afterContextSet)=\"afterContextSet($event)\"\n               (beforeContextSet)=\"beforeContextSet($event)\">\n\n        <!--<b>MetaElementList: layout {{cLayout.name}} </b>-->\n        <!--<pre [innerHTML]=\"debugString(cLayout.name)\"></pre>-->\n\n        <div class=\"ui-g \">\n            <div class=\"ui-g-12 ui-g-nopad\" [ngClass]=\"classString(cLayout.name)\"\n                 [ngStyle]=\"styleString(cLayout.name)\"\n            >\n                <m-include-component></m-include-component>\n            </div>\n        </div>\n    </m-context>\n\n</ng-template>\n\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    MetaElementListComponent.ctorParameters = function () { return [
        { type: MetaContextComponent },
        { type: Environment },
        { type: DomSanitizer }
    ]; };
    return MetaElementListComponent;
}(MetaLayout));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MetaActionList provides a way how to attach actions to the screen. We can use \@action declaration
 * to define new action and their actionResults. actionResults is an expression that is executed
 * and either redirect you to different page or some logic is executed.
 *
 * Actions can be organized into action categories but if we do not provide any action category
 * default one is used.
 *
 * This way we define placeholder using a layout where actions are inserted
 *
 *
 * ```html
 *
 *    layout=Inspect2#Stack {
 * \@layout=MenuTop#ActionButtons {
 *       }
 *
 * \@layout=First#Form {
 *     }
 *
 * \@layout=Second#Form { zonePath:Second; }
 *  }
 *
 *
 * ```
 *
 * And this is how we define actions for current page/class/object
 *
 * ```
 * \@action=update {
 *             actionResults:${ object.firstName = "Mr." +  object.firstName };
 *             visible: ${ properties.editing };
 *    }
 *
 *
 * \@action=Save {
 *             label: "My Save";
 *             actionResults:${ object.firstName = "Ms." +  object.firstName };
 *             visible: ${ properties.editing };
 *             buttonStyle:info;
 *    }
 * ```
 *
 *
 *
 *
 *
 *
 *
 */
var MetaActionListComponent = /** @class */ (function (_super) {
    __extends(MetaActionListComponent, _super);
    function MetaActionListComponent(_metaContext, env) {
        var _this = _super.call(this, env, _metaContext) || this;
        _this._metaContext = _metaContext;
        _this.env = env;
        /**
         *
         * Defines type of components that renders our actions. We have 3 types:
         * Buttons, Links and Popup Menu
         *
         */
        _this.renderAs = 'buttons';
        /**
         * Default style used for the buttons if none is specified
         *
         */
        _this.defaultStyle = 'info';
        /**
         * Tells us if the action should be rendered on the left or right side
         *
         */
        _this.align = 'right';
        /**
         * Map linking the name of the layout to the actual context. We need this when we need
         * to access current content.
         *
         */
        _this._contextMap = new Map();
        return _this;
    }
    // protected updateMeta(): any
    // {
    //     // todo: replace it with EventEmmitter.
    //     this._actionsByCategory = null;
    //     this._actionsByName = null;
    //     return super.updateMeta();
    // }
    /**
     * Read and stores current action categories available to current Context
     *
     */
    /**
     * Read and stores current action categories available to current Context
     *
     * @return {?}
     */
    MetaActionListComponent.prototype.actionCategories = /**
     * Read and stores current action categories available to current Context
     *
     * @return {?}
     */
    function () {
        var _this = this;
        if (isBlank(this._actionsByCategory) || isBlank(this._actionsByName)) {
            if (isPresent(this.filterActions)) {
                this.context.set('filterActions', this.filterActions);
            }
            var /** @type {?} */ meta = /** @type {?} */ (this.context.meta);
            this.context.push();
            this.menuModel = [];
            this._actionsByCategory = new Map();
            this._actionsByName = new Map();
            this.categories = meta.actionsByCategory(this.context, this._actionsByCategory, UIMeta.ActionZones);
            this.context.pop();
            this._actionsByCategory.forEach(function (v, k) {
                v.forEach(function (item) { return _this._actionsByName.set(item.name, item); });
            });
        }
        return this.categories;
    };
    /**
     *
     * Action belonging to current category..
     *
     */
    /**
     *
     * Action belonging to current category..
     *
     * @param {?} category
     * @return {?}
     */
    MetaActionListComponent.prototype.actions = /**
     *
     * Action belonging to current category..
     *
     * @param {?} category
     * @return {?}
     */
    function (category) {
        return this._actionsByCategory.get(category.name);
    };
    /**
     *
     * When action clicked this method delegates it into meta layer to be executed.
     *
     */
    /**
     *
     * When action clicked this method delegates it into meta layer to be executed.
     *
     * @param {?} action
     * @return {?}
     */
    MetaActionListComponent.prototype.actionClicked = /**
     *
     * When action clicked this method delegates it into meta layer to be executed.
     *
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var /** @type {?} */ context = this._contextMap.get(action);
        var /** @type {?} */ meta = /** @type {?} */ (context.meta);
        meta.fireActionFromProps(this._actionsByName.get(action), /** @type {?} */ (context));
    };
    /**
     * A hook used to store the most current context for each action.
     *
     */
    /**
     * A hook used to store the most current context for each action.
     *
     * @param {?} actionName
     * @return {?}
     */
    MetaActionListComponent.prototype.onAfterContextSet = /**
     * A hook used to store the most current context for each action.
     *
     * @param {?} actionName
     * @return {?}
     */
    function (actionName) {
        var /** @type {?} */ aContext = this._metaContext.activeContext().snapshot().hydrate(false);
        this._contextMap.set(actionName, aContext);
        if (this.renderAs === 'menu') {
            this.populateMenu(actionName);
        }
    };
    /**
     * A hook used to store the most current context for each action.
     *
     */
    /**
     * A hook used to store the most current context for each action.
     *
     * @param {?} change
     * @return {?}
     */
    MetaActionListComponent.prototype.onContextChanged = /**
     * A hook used to store the most current context for each action.
     *
     * @param {?} change
     * @return {?}
     */
    function (change) {
        console.log('Changed = ' + change);
    };
    /**
     * @param {?} actionName
     * @return {?}
     */
    MetaActionListComponent.prototype.label = /**
     * @param {?} actionName
     * @return {?}
     */
    function (actionName) {
        var /** @type {?} */ context = this._contextMap.get(actionName);
        return _super.prototype.aProperties.call(this, context, UIMeta.KeyLabel);
    };
    /**
     * @param {?} actionName
     * @return {?}
     */
    MetaActionListComponent.prototype.isActionDisabled = /**
     * @param {?} actionName
     * @return {?}
     */
    function (actionName) {
        var /** @type {?} */ context = this._contextMap.get(actionName);
        return isPresent(context) ? !context.booleanPropertyForKey('enabled', false) : true;
    };
    /**
     * @return {?}
     */
    MetaActionListComponent.prototype.alignRight = /**
     * @return {?}
     */
    function () {
        return this.align === 'right';
    };
    /**
     * @param {?} actionName
     * @return {?}
     */
    MetaActionListComponent.prototype.style = /**
     * @param {?} actionName
     * @return {?}
     */
    function (actionName) {
        var /** @type {?} */ context = this._contextMap.get(actionName);
        var /** @type {?} */ style = _super.prototype.aProperties.call(this, context, 'buttonStyle');
        return isPresent(style) ? style : this.defaultStyle;
    };
    /**
     * @param {?} actionName
     * @return {?}
     */
    MetaActionListComponent.prototype.populateMenu = /**
     * @param {?} actionName
     * @return {?}
     */
    function (actionName) {
        var _this = this;
        var /** @type {?} */ label = this.label(actionName);
        var /** @type {?} */ index = this.menuModel.findIndex(function (item) { return item.actionName === actionName; });
        var /** @type {?} */ itemCommand = {
            label: label,
            actionName: actionName,
            disabled: this.isActionDisabled(actionName),
            command: function (event) {
                _this.actionClicked(event.item.actionName);
            }
        };
        if (index === -1) {
            this.menuModel.push(itemCommand);
        }
        else {
            this.menuModel[index] = itemCommand;
        }
    };
    MetaActionListComponent.decorators = [
        { type: Component, args: [{
                    template: "<span [class.u-flr]=\"alignRight()\">\n    <m-context *ngIf=\"renderAs === 'buttons'\">\n        <ng-template ngFor [ngForOf]=\"actionCategories()\" let-category>\n            <m-context [actionCategory]=\"category.name\">\n                <ng-template ngFor [ngForOf]=\"actions(category)\" let-action>\n                    <m-context [action]=\"action.name\"\n                               (onContextChanged)=\"onContextChanged($event)\"\n                               (afterContextSet)=\"onAfterContextSet($event)\">\n                        <aw-button (action)=\"actionClicked(action.name)\"\n                                   [style]=\"style(action.name)\"\n                                   [disabled]=\"isActionDisabled(action.name)\">\n\n                        {{ label(action.name) }}\n                        </aw-button>\n                    </m-context>\n                </ng-template>\n            </m-context>\n\n        </ng-template>\n    </m-context>\n\n    <m-context *ngIf=\"renderAs === 'links'\">\n        <ng-template ngFor [ngForOf]=\"actionCategories()\" let-category>\n            <m-context [actionCategory]=\"category.name\">\n                <ng-template ngFor [ngForOf]=\"actions(category)\" let-action>\n                    <m-context [action]=\"action.name\"\n                               (onContextChanged)=\"onContextChanged($event)\"\n                               (afterContextSet)=\"onAfterContextSet($event)\">\n                        <aw-button (action)=\"actionClicked(action.name)\"\n                                   [style]=\"'link'\"\n                                   [disabled]=\"isActionDisabled(action.name)\">\n\n                        {{ label(action.name) }}\n                        </aw-button>\n                    </m-context>\n                </ng-template>\n            </m-context>\n\n        </ng-template>\n    </m-context>\n\n    <m-context *ngIf=\"renderAs === 'menu'\">\n        <ng-template ngFor [ngForOf]=\"actionCategories()\" let-category>\n            <m-context [actionCategory]=\"category.name\">\n\n                <ng-template ngFor [ngForOf]=\"actions(category)\" let-action>\n                    <m-context [action]=\"action.name\"\n                               (onContextChanged)=\"onContextChanged($event)\"\n                               (afterContextSet)=\"onAfterContextSet($event)\">\n                    </m-context>\n                </ng-template>\n            </m-context>\n        </ng-template>\n\n        <p-menu #menu popup=\"popup\" [model]=\"menuModel\"></p-menu>\n\n        <!-- todo: extend button to support icons -->\n        <aw-button (action)=\"menu.toggle($event)\">\n            Actions\n        </aw-button>\n\n    </m-context>\n</span>\n\n\n\n\n\n",
                    styles: [".m-action-list{width:100%}"]
                },] },
    ];
    /** @nocollapse */
    MetaActionListComponent.ctorParameters = function () { return [
        { type: MetaContextComponent },
        { type: Environment }
    ]; };
    MetaActionListComponent.propDecorators = {
        renderAs: [{ type: Input }],
        defaultStyle: [{ type: Input }],
        align: [{ type: Input }],
        filterActions: [{ type: Input }]
    };
    return MetaActionListComponent;
}(MetaBaseComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Default homePage implementation for a Module. Just like on the example bellow when we define a
 * module without a homePage this MetaHomePageComponent will be used.
 *
 * ```
 *
 * \@module=Home {
 *       label:"My Home";
 *       pageTitle:"You are now on Homepage";
 *
 * \@layout=Today {
 *          after:zTop;
 *          label: "Sales Graph";
 *          component:SalesGraphComponent;
 *     }
 *  }
 *
 * ```
 * Or you can decide not to use this MetaHomePage and Provide your own e.g:
 *
 * ```
 * \@module=Products {
 *      label:"Products for Somethig";
 *      pageTitle:"You are now on Products";
 *      homePage:ProductContentComponent;
 *  }
 *
 * ```
 *
 *
 */
var MetaHomePageComponent = /** @class */ (function (_super) {
    __extends(MetaHomePageComponent, _super);
    function MetaHomePageComponent(env, activatedRoute) {
        var _this = _super.call(this, env) || this;
        _this.env = env;
        _this.activatedRoute = activatedRoute;
        return _this;
    }
    /**
     *
     * This page is triggered by router and we expect a module to be passed in by routing
     * params
     *
     */
    /**
     *
     * This page is triggered by router and we expect a module to be passed in by routing
     * params
     *
     * @return {?}
     */
    MetaHomePageComponent.prototype.ngOnInit = /**
     *
     * This page is triggered by router and we expect a module to be passed in by routing
     * params
     *
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        var /** @type {?} */ routeParams = this.activatedRoute.snapshot.params;
        if (isPresent(routeParams) && isPresent(routeParams[UIMeta.KeyModule])) {
            this.module = routeParams[UIMeta.KeyModule];
        }
    };
    /**
     * @return {?}
     */
    MetaHomePageComponent.prototype.hasModule = /**
     * @return {?}
     */
    function () {
        return isPresent(this.module);
    };
    MetaHomePageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-home-page',
                    template: "<div class=\"m-page\" *ngIf=\"hasModule()\">\n    <m-context [module]=\"module\">\n        <m-include-component></m-include-component>\n    </m-context>\n\n</div>\n\n\n",
                    styles: [".m-page{width:100%;margin:0 auto;padding:5px}.m-page:after{content:\".\";display:block;height:0;clear:both;visibility:hidden}.module-footer{clear:both}"]
                },] },
    ];
    /** @nocollapse */
    MetaHomePageComponent.ctorParameters = function () { return [
        { type: Environment },
        { type: ActivatedRoute }
    ]; };
    MetaHomePageComponent.propDecorators = {
        module: [{ type: Input }]
    };
    return MetaHomePageComponent;
}(BaseComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *
 * Defines 4 sizes for the portlet size
 *
 */
var /** @type {?} */ PortletSizes = {
    'small': 'ui-md-3',
    'medium': 'ui-md-4',
    'wide': 'ui-md-6',
    'large': 'ui-md-12'
};
/**
 * Simple Dashboard implementation for the homePage. Just like we support inside MetaFormTable
 * different zones and distribute fields to them, we do the same with defined layouts.
 *
 * This dashboard supports 3 zones.
 *
 *    zToc: This is the place where usually all the actions or 2nd level navigation will go
 *    zTop,zBottom: is where the portlets are rendered.
 *
 *
 * To distribute layouts to different zones :
 *
 * ```
 * \@module=Home {
 *           label:"My Home";
 *           pageTitle:"You are now on Homepage";
 *
 *
 * \@layout=Today {
 *              after:zTop;
 *              label: "Sales Graph";
 *              component:SalesGraphComponent;
 *
 *           }
 *
 * \@layout=Sport {
 *              after:Today;
 *              label: "Sport today!";
 *              component:StringComponent;
 *              bindings:{value:"The Texas Tech quarterback arrived at  " }
 *
 *           }
 *
 * ```
 *
 *  or Push actions to the zToc zone:
 *
 * ```
 * \@module=Home {
 *           label:"My Home";
 *           pageTitle:"You are now on Homepage";
 *
 *
 * \@layout=Today {
 *              after:zTop;
 *              label: "Sales Graph";
 *              component:SalesGraphComponent;
 *
 *           }
 *
 * \@layout=Actions#ActionLinks {
 *               label:$[a004]Actions;
 *                after:zToc;
 *            }
 *
 *
 * \@actionCategory=Create {
 * \@action=NewBlog#pageAction { pageName:blogPage;}
 * \@action=NewChart#pageAction { pageName:chartPage;}
 *           }
 *
 * }
 *
 *
 *
 */
var MetaDashboardLayoutComponent = /** @class */ (function (_super) {
    __extends(MetaDashboardLayoutComponent, _super);
    function MetaDashboardLayoutComponent(metaContext, env) {
        var _this = _super.call(this, metaContext, env) || this;
        /**
         * Defines if sidebar is collapsed or expanded
         *
         */
        _this.activeMenu = false;
        /**
         * Current Module name
         *
         */
        _this.dashboardName = '';
        return _this;
    }
    /**
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        this.dashboardName = this.label();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.toggleMenu = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.activeMenu = !this.activeMenu;
    };
    /**
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.zones = /**
     * @return {?}
     */
    function () {
        return MetaDashboardLayoutComponent.ZonesTB;
    };
    /**
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.topLayouts = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ tops = this.layoutsByZones.get(UIMeta.ZoneTop);
        return isPresent(tops) ? tops : [];
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.portletWidth = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var /** @type {?} */ lContext = this.contextMap.get(name);
        var /** @type {?} */ width = lContext.propertyForKey('portletWidth');
        return isPresent(width) && isPresent(PortletSizes[width]) ? PortletSizes[width] :
            'ui-md-4';
    };
    /**
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.bottomLayouts = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ bottom = this.layoutsByZones.get(UIMeta.ZoneBottom);
        return isPresent(bottom) ? bottom : [];
    };
    /**
     * @return {?}
     */
    MetaDashboardLayoutComponent.prototype.zTocLayouts = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ bottom = this.layoutsByZones.get(MetaDashboardLayoutComponent.ZoneToc);
        return isPresent(bottom) ? bottom : [];
    };
    /**
     * New defined zone for Actions
     *
     */
    MetaDashboardLayoutComponent.ZoneToc = 'zToc';
    MetaDashboardLayoutComponent.ZonesTB = [
        MetaDashboardLayoutComponent.ZoneToc, UIMeta.ZoneTop,
        UIMeta.ZoneBottom
    ];
    MetaDashboardLayoutComponent.decorators = [
        { type: Component, args: [{
                    template: "<div>\n    <span class=\"m-dashbord-name\">{{dashboardName}} </span>\n    <span class=\"m-dashbord-lbl\"> Dashboard</span>\n</div>\n\n\n<div id=\"m-toggle-bar\" *ngIf=\"zTocLayouts().length > 0\">\n    <aw-hyperlink (action)=\"toggleMenu($event)\" [size]=\"'large'\">\n        <i class=\"fa fa-bars\"></i>\n    </aw-hyperlink>\n</div>\n<div id=\"m-toc\" [class.active]=\"activeMenu\" *ngIf=\"zTocLayouts().length > 0\">\n    <div class=\"ui-g \">\n        <m-context *ngFor=\"let layout of zTocLayouts()\"\n                   [layout]=\"layout.name\" (afterContextSet)=\"afterContextSet($event)\"\n                   (beforeContextSet)=\"beforeContextSet($event)\">\n\n            <div class=\"ui-g-12 \" [ngClass]=\"portletWidth(layout.name)\">\n                <p-panel [header]=\"labelForContext(layout.name)\">\n                    <m-include-component></m-include-component>\n                </p-panel>\n            </div>\n        </m-context>\n    </div>\n</div>\n\n<div id=\"m-content\">\n    <div class=\"ui-g m-dashboard\">\n        <!-- top -->\n        <div class=\"ui-g-12\">\n            <div class=\"ui-g \">\n                <m-context *ngFor=\"let layout of topLayouts()\"\n                           [layout]=\"layout.name\" (afterContextSet)=\"afterContextSet($event)\"\n                           (beforeContextSet)=\"beforeContextSet($event)\">\n\n                    <div class=\"ui-g-12 \" [ngClass]=\"portletWidth(layout.name)\">\n                        <p-panel [header]=\"labelForContext(layout.name)\" [toggleable]=\"true\">\n                            <m-include-component></m-include-component>\n                        </p-panel>\n                    </div>\n                </m-context>\n            </div>\n        </div>\n\n        <!-- bottom -->\n        <div class=\"ui-g-12\">\n            <div class=\"ui-g \">\n                <m-context *ngFor=\"let layout of bottomLayouts()\"\n                           [layout]=\"layout.name\" (afterContextSet)=\"afterContextSet($event)\"\n                           (beforeContextSet)=\"beforeContextSet($event)\">\n\n                    <div class=\"ui-g-12 \" [ngClass]=\"portletWidth(layout.name)\">\n                        <p-panel [header]=\"labelForContext(layout.name)\" [toggleable]=\"true\">\n                            <m-include-component></m-include-component>\n                        </p-panel>\n                    </div>\n                </m-context>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n\n",
                    styles: ["#m-toc{position:relative;float:left;z-index:99;width:15em;padding:.5em;box-shadow:6px 0 10px -4px rgba(0,0,0,.3)}#m-content{float:left;padding-top:1em;padding-left:1em;height:auto}#m-toggle-bar{box-sizing:border-box;border-bottom:1px solid #dde3e6;overflow:hidden;display:none;border-radius:5px;padding:.5em;width:2em;height:2.3em}#m-toggle-bar:focus,#m-toggle-bar:hover{background-color:#ececec}#m-toggle-bar:after{content:'';display:block;clear:both}.m-dashbord-name{font-weight:600}.ui-g{display:block}@media screen and (max-width:64em){#m-toc{display:none;overflow-y:auto;z-index:999}#m-toc.active{display:block}#m-toggle-bar{display:block;position:relative;z-index:1000;margin-right:1em}}"]
                },] },
    ];
    /** @nocollapse */
    MetaDashboardLayoutComponent.ctorParameters = function () { return [
        { type: MetaContextComponent },
        { type: Environment }
    ]; };
    return MetaDashboardLayoutComponent;
}(MetaLayout));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MetaSection renders list of sections defined by \@trait inside WidgetsRules. It uses layouts to
 * structure the list.
 *
 * ```
 *  layout {
 * \@trait=Sections { visible:true; component:MetaSectionsComponent }
 *  }
 *
 * ```
 *
 * and can be used as :
 *
 * ```
 *     layout=RfxDetailLayout#Sections {
 *
 * \@layout=Header#Form {
 *             trait:labelsOnTop;
 *             zonePath:Header;
 *
 *             bindings: {
 *                 description:$object.header.description;
 *             }
 *         }
 * \@layout=LineItems {
 *             component:RfxLineItemsComponent;
 *             bindings: {
 *                 rfxEvent:$object;
 *             }
 *         }
 * \@layout=Participants {
 *             component:RfxParticipantsComponent;
 *             bindings: {
 *                 rfxEvent:$object;
 *             }
 *         }
 *     }
 *
 *
 *     class=RfxEventHeader {
 *         zNone => *;
 *         Header.zLeft => requester => region => needBy;
 *     }
 * ```
 * In above example we have first section with Form where RfxEventHeader sends its fields
 * and several other sections with custom component.
 *
 *
 */
var MetaSectionsComponent = /** @class */ (function (_super) {
    __extends(MetaSectionsComponent, _super);
    function MetaSectionsComponent(_metaContext, env) {
        var _this = _super.call(this, _metaContext, env) || this;
        _this._metaContext = _metaContext;
        _this.env = env;
        _this.sectionOperations = {};
        _this.onCompleteSubscriptions = {};
        return _this;
    }
    /**
     * @return {?}
     */
    MetaSectionsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.allLayouts.forEach(function (value) {
            _this.sectionOperations[value.name] = 'view';
        });
    };
    /**
     * @return {?}
     */
    MetaSectionsComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngDoCheck.call(this);
    };
    /**
     * @return {?}
     */
    MetaSectionsComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.sections = __spread(this.viewSections.toArray());
    };
    /**
     * Action handler to broadcast event outside so it can be handled by the application
     *
     */
    /**
     * Action handler to broadcast event outside so it can be handled by the application
     *
     * @param {?} name
     * @param {?} sectionIndex
     * @param {?} cnxName
     * @param {?} event
     * @return {?}
     */
    MetaSectionsComponent.prototype.onAction = /**
     * Action handler to broadcast event outside so it can be handled by the application
     *
     * @param {?} name
     * @param {?} sectionIndex
     * @param {?} cnxName
     * @param {?} event
     * @return {?}
     */
    function (name, sectionIndex, cnxName, event) {
        var _this = this;
        var /** @type {?} */ section = this.sections[sectionIndex];
        if (this.env.hasValue('parent-cnx')) {
            var /** @type {?} */ cnx = this.env.getValue('parent-cnx');
            cnx.onAction.emit(new MetaUIActionEvent(section, name, cnxName, event));
        }
        if (name === 'onEdit' && section.editState && section.editMode === 'default') {
            this.sectionOperations[cnxName] = 'edit';
            if (isBlank(this.onCompleteSubscriptions[cnxName])) {
                section.onEditingComplete.subscribe(function (value) {
                    return _this.sectionOperations[cnxName] = 'view';
                });
                this.onCompleteSubscriptions[cnxName] = section;
            }
        }
    };
    /**
     *
     * Retrieves a property from the current context
     *
     */
    /**
     *
     * Retrieves a property from the current context
     *
     * @param {?} propName
     * @param {?} cnxName
     * @param {?} defaultVal
     * @return {?}
     */
    MetaSectionsComponent.prototype.sectionProp = /**
     *
     * Retrieves a property from the current context
     *
     * @param {?} propName
     * @param {?} cnxName
     * @param {?} defaultVal
     * @return {?}
     */
    function (propName, cnxName, defaultVal) {
        var /** @type {?} */ lContext = this.contextMap.get(cnxName);
        return (isPresent(lContext) && isPresent(lContext.propertyForKey(propName))) ?
            lContext.propertyForKey(propName) : defaultVal;
    };
    /**
     * @return {?}
     */
    MetaSectionsComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        _super.prototype.ngOnDestroy.call(this);
        this.allLayouts.forEach(function (value) {
            if (isPresent(_this.onCompleteSubscriptions[value.name])) {
                _this.onCompleteSubscriptions[value.name].onEditingComplete.unsubscribe();
            }
        });
    };
    MetaSectionsComponent.decorators = [
        { type: Component, args: [{
                    template: "<div class=\"meta-sections\">\n\n    <m-context *ngFor=\"let layout of allLayouts; let i = index\" [layout]=\"layout.name\"\n               [operation]=\"sectionOperations[layout.name]\"\n               (afterContextSet)=\"afterContextSet($event)\"\n               (beforeContextSet)=\"beforeContextSet($event)\">\n\n        <aw-section [title]=\"sectionProp('title', layout.name, null)\"\n                    [description]=\"sectionProp('description', layout.name, null)\"\n                    [opened]=\"sectionProp('opened', layout.name, true)\"\n                    [actionIcon]=\"sectionProp('actionIcon', layout.name, 'icon-edit')\"\n                    [editable]=\"sectionProp('canEdit', layout.name, false)\"\n                    [editMode]=\"sectionProp('editMode', layout.name, 'default')\"\n                    [disableClose]=\"sectionProp('disableClose', layout.name, false)\"\n                    (onEdit)=\"onAction('onEdit', i, layout.name, $event)\"\n                    (onSaveAction)=\"onAction('onSaveAction', i, layout.name, $event)\"\n                    (onCancelAction)=\"onAction('onCancelAction', i, layout.name, $event)\">\n\n            <m-include-component></m-include-component>\n        </aw-section>\n\n    </m-context>\n</div>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    MetaSectionsComponent.ctorParameters = function () { return [
        { type: MetaContextComponent },
        { type: Environment }
    ]; };
    MetaSectionsComponent.propDecorators = {
        viewSections: [{ type: ViewChildren, args: [SectionComponent,] }]
    };
    return MetaSectionsComponent;
}(MetaLayout));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Just like MetaContentPage this components renders meta context details but embedded as some
 * inline component. Not a page with page level buttons
 *
 *
 * Todo: We dont really need this component we we in the future extends MetaIncludeComponent to
 * support awcontentElement:
 *
 * ```
 *  {
 *      component:MetaContextComponent;
 *      bindings: {
 *          object:$value;
 *          layout:Inspect;
 *          operation:view;
 *          awcontentElement:MetaIncludeComponnetDirective;
 *      }
 *
 *  }
 *
 *  ```
 *
 *  This would instantiate right meta context just like this class.
 */
var MetaObjectDetailComponent = /** @class */ (function (_super) {
    __extends(MetaObjectDetailComponent, _super);
    function MetaObjectDetailComponent(env) {
        var _this = _super.call(this, env) || this;
        _this.env = env;
        /**
         * For the detail view we always use read only content
         */
        _this.operation = 'view';
        /**
         * Default layout
         *
         */
        _this.layout = 'Inspect';
        return _this;
    }
    /**
     * @return {?}
     */
    MetaObjectDetailComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (isBlank(this.object) || !isStringMap(this.object)) {
            throw new Error('Cannot render primitive values as object details!');
        }
    };
    MetaObjectDetailComponent.decorators = [
        { type: Component, args: [{
                    selector: 'm-content-detail',
                    template: "<m-context [pushNewContext]=\"true\" [object]=\"object\" [operation]=\"operation\"\n           [layout]=\"layout\" group=\"ObjectDetail\">\n\n    <div class=\"w-object-detail\">\n        <m-include-component></m-include-component>\n    </div>\n\n</m-context>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    MetaObjectDetailComponent.ctorParameters = function () { return [
        { type: Environment }
    ]; };
    MetaObjectDetailComponent.propDecorators = {
        object: [{ type: Input }],
        operation: [{ type: Input }],
        layout: [{ type: Input }]
    };
    return MetaObjectDetailComponent;
}(BaseComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AWMetaLayoutModule = /** @class */ (function () {
    function AWMetaLayoutModule() {
    }
    AWMetaLayoutModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MetaIncludeComponentDirective,
                        MetaFormComponent,
                        MetaFormTableComponent,
                        MetaFormRowComponent,
                        NoMetaComponent,
                        MetaContentPageComponent,
                        MetaElementListComponent,
                        MetaActionListComponent,
                        MetaHomePageComponent,
                        MetaDashboardLayoutComponent,
                        MetaSectionsComponent,
                        MetaObjectDetailComponent,
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        AWMetaCoreModule,
                        AribaCoreModule,
                        AribaComponentsModule
                    ],
                    entryComponents: [
                        MetaFormComponent,
                        MetaFormTableComponent,
                        MetaFormRowComponent,
                        NoMetaComponent,
                        MetaContentPageComponent,
                        MetaContentPageComponent,
                        MetaElementListComponent,
                        MetaActionListComponent,
                        MetaHomePageComponent,
                        MetaDashboardLayoutComponent,
                        MetaSectionsComponent,
                        MetaObjectDetailComponent
                    ],
                    exports: [
                        MetaIncludeComponentDirective,
                        MetaFormComponent,
                        MetaFormTableComponent,
                        MetaFormRowComponent,
                        NoMetaComponent,
                        MetaContentPageComponent,
                        MetaContentPageComponent,
                        MetaElementListComponent,
                        MetaActionListComponent,
                        MetaHomePageComponent,
                        MetaDashboardLayoutComponent,
                        MetaSectionsComponent,
                        ReactiveFormsModule,
                        FormsModule,
                        AribaCoreModule,
                        AribaComponentsModule,
                        MetaObjectDetailComponent
                    ],
                    providers: []
                },] },
    ];
    return AWMetaLayoutModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var sysMetaComponents = /*#__PURE__*/Object.freeze({
    ACTIVE_CNTX: ACTIVE_CNTX,
    MetaContextComponent: MetaContextComponent,
    MetaUIActionEvent: MetaUIActionEvent,
    AWMetaLayoutModule: AWMetaLayoutModule,
    MetaContentPageComponent: MetaContentPageComponent,
    MetaFormComponent: MetaFormComponent,
    MetaFormRowComponent: MetaFormRowComponent,
    MetaFormTableComponent: MetaFormTableComponent,
    NoMetaComponent: NoMetaComponent,
    MetaIncludeComponentDirective: MetaIncludeComponentDirective,
    MetaBaseComponent: MetaBaseComponent,
    MetaElementListComponent: MetaElementListComponent,
    MetaActionListComponent: MetaActionListComponent,
    MetaHomePageComponent: MetaHomePageComponent,
    MetaDashboardLayoutComponent: MetaDashboardLayoutComponent,
    MetaSectionsComponent: MetaSectionsComponent,
    MetaObjectDetailComponent: MetaObjectDetailComponent
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ routes = [
    { path: 'context', component: MetaContentPageComponent }
];
var AribaMetaUIRoutingModule = /** @class */ (function () {
    function AribaMetaUIRoutingModule() {
    }
    AribaMetaUIRoutingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        RouterModule.forChild(routes)
                    ],
                    exports: [RouterModule],
                    providers: []
                },] },
    ];
    return AribaMetaUIRoutingModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This module contains everything needs to dynamically generated UI based on metaRules
 * Since we are using primeNG, check AribaComponent if its already imported so you dont have
 * import it again.
 *
 */
var AribaMetaUIModule = /** @class */ (function () {
    function AribaMetaUIModule() {
    }
    AribaMetaUIModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        AribaMetaUIRoutingModule,
                        AWMetaCoreModule,
                        AWMetaLayoutModule
                    ],
                    exports: [
                        AWMetaCoreModule,
                        AWMetaLayoutModule
                    ],
                    providers: [
                        {
                            'provide': APP_INITIALIZER,
                            'useFactory': initMetaUI,
                            'deps': [Injector],
                            'multi': true,
                        },
                    ],
                },] },
    ];
    /** @nocollapse */
    AribaMetaUIModule.ctorParameters = function () { return []; };
    return AribaMetaUIModule;
}());
/**
 *
 * Entry factory method that initialize The METAUI layer and here we load WidgetsRules.oss as well
 * as Persistence Rules.
 *
 * @param {?} injector
 * @return {?}
 */
function initMetaUI(injector) {
    var /** @type {?} */ initFce = function init(inj) {
        var /** @type {?} */ promise = new Promise(function (resolve) {
            var /** @type {?} */ metaUI = UIMeta.getInstance();
            // access services lazily when they are needed and initialized as workaround for
            // https://github.com/angular/angular/issues/16853
            metaUI.injector = inj;
            metaUI.registerLoader(new RuleLoaderService());
            metaUI.loadDefaultRuleFiles(sysMetaComponents);
            resolve(true);
        });
        return promise;
    };
    return initFce.bind(initFce, injector);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { Activation, Assignment, AssignmentSnapshot, Context, DeferredAssignment, ObjectMetaContext, PropertyAccessor, Snapshot, StaticRec, UIContext, ItemProperties, Match, MatchResult, MatchWithUnion, UnionMatchResult, Meta, KeyValueCount, PropertyManager, OverrideValue, KeyData, PropertyMap, PropertyMergerDynamic, PropertyMerger_Overwrite, PropertyMerger_List, PropertyMergerDeclareList, PropertyMergerDeclareListForTrait, PropertyMerger_And, PropertyMerger_Valid, RuleSet, ValueMatches, MultiMatchValue, KeyValueTransformer_KeyPresent, isPropertyMapAwaking, NestedMap, FieldTypeIntrospectionMetaProvider, IntrospectionMetaProvider, ObjectMeta, ObjectMetaPropertyMap, OMPropertyMerger_Valid, SystemPersistenceRules, DynamicPropertyValue, StaticallyResolvable, StaticDynamicWrapper, StaticallyResolvableWrapper, ContextFieldPath, isDynamicSettable, Expr, DeferredOperationChain, ValueConverter, Rule, RuleWrapper, Selector, RuleLoaderService, LocalizedString, UIMeta, SystemRules, ModuleInfo, AWMetaCoreModule, MetaUIActionEvent, MetaContentPageComponent, MetaFormComponent, MetaFormRowComponent, MetaFormTableComponent, NoMetaComponent, MetaIncludeComponentDirective, MetaBaseComponent, MetaElementListComponent, MetaHomePageComponent, AWMetaLayoutModule, MetaSectionsComponent, MetaObjectDetailComponent, MetaContextComponent, AribaMetaUIModule, initMetaUI, AribaMetaUIRoutingModule, MetaActionListComponent as ɵa, MetaDashboardLayoutComponent as ɵb, MetaLayout as ɵc };
