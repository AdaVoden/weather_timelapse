
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Player.svelte generated by Svelte v3.42.1 */

    const { isNaN: isNaN_1 } = globals;
    const file$1 = "src/Player.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let video;
    	let track;
    	let video_src_value;
    	let video_updating = false;
    	let video_animationframe;
    	let video_is_paused = true;
    	let t0;
    	let div1;
    	let progress;
    	let progress_value_value;
    	let t1;
    	let div0;
    	let span0;
    	let t2_value = format(/*time*/ ctx[0]) + "";
    	let t2;
    	let t3;
    	let span1;
    	let t4;
    	let t5_value = (/*paused*/ ctx[2] ? 'play' : 'pause') + "";
    	let t5;
    	let t6;
    	let t7;
    	let span2;
    	let t8_value = format(/*duration*/ ctx[1]) + "";
    	let t8;
    	let mounted;
    	let dispose;

    	function video_timeupdate_handler() {
    		cancelAnimationFrame(video_animationframe);

    		if (!video.paused) {
    			video_animationframe = raf(video_timeupdate_handler);
    			video_updating = true;
    		}

    		/*video_timeupdate_handler*/ ctx[7].call(video);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			video = element("video");
    			track = element("track");
    			t0 = space();
    			div1 = element("div");
    			progress = element("progress");
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			span1 = element("span");
    			t4 = text("click anywhere to ");
    			t5 = text(t5_value);
    			t6 = text(" / drag to seek");
    			t7 = space();
    			span2 = element("span");
    			t8 = text(t8_value);
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$1, 54, 4, 1821);
    			attr_dev(video, "poster", "https://sveltejs.github.io/assets/caminandes-llamigos.jpg");
    			if (!src_url_equal(video.src, video_src_value = "https://sveltejs.github.io/assets/caminandes-llamigos.mp4")) attr_dev(video, "src", video_src_value);
    			attr_dev(video, "class", "svelte-c2hpa");
    			if (/*duration*/ ctx[1] === void 0) add_render_callback(() => /*video_durationchange_handler*/ ctx[8].call(video));
    			add_location(video, file$1, 47, 2, 1449);
    			progress.value = progress_value_value = /*time*/ ctx[0] / /*duration*/ ctx[1] || 0;
    			attr_dev(progress, "class", "svelte-c2hpa");
    			add_location(progress, file$1, 58, 4, 1940);
    			attr_dev(span0, "class", "time svelte-c2hpa");
    			add_location(span0, file$1, 61, 6, 2016);
    			attr_dev(span1, "class", "svelte-c2hpa");
    			add_location(span1, file$1, 62, 6, 2063);
    			attr_dev(span2, "class", "time svelte-c2hpa");
    			add_location(span2, file$1, 63, 6, 2143);
    			attr_dev(div0, "class", "info svelte-c2hpa");
    			add_location(div0, file$1, 60, 4, 1991);
    			attr_dev(div1, "class", "controls svelte-c2hpa");
    			set_style(div1, "opacity", /*duration*/ ctx[1] && /*showControls*/ ctx[3] ? 1 : 0);
    			add_location(div1, file$1, 57, 2, 1861);
    			attr_dev(div2, "class", "svelte-c2hpa");
    			add_location(div2, file$1, 46, 0, 1441);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, video);
    			append_dev(video, track);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, progress);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, span1);
    			append_dev(span1, t4);
    			append_dev(span1, t5);
    			append_dev(span1, t6);
    			append_dev(div0, t7);
    			append_dev(div0, span2);
    			append_dev(span2, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(video, "mousemove", /*handleMove*/ ctx[4], false, false, false),
    					listen_dev(video, "touchmove", prevent_default(/*handleMove*/ ctx[4]), false, true, false),
    					listen_dev(video, "mousedown", /*handleMousedown*/ ctx[5], false, false, false),
    					listen_dev(video, "mouseup", /*handleMouseup*/ ctx[6], false, false, false),
    					listen_dev(video, "timeupdate", video_timeupdate_handler),
    					listen_dev(video, "durationchange", /*video_durationchange_handler*/ ctx[8]),
    					listen_dev(video, "play", /*video_play_pause_handler*/ ctx[9]),
    					listen_dev(video, "pause", /*video_play_pause_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!video_updating && dirty & /*time*/ 1 && !isNaN_1(/*time*/ ctx[0])) {
    				video.currentTime = /*time*/ ctx[0];
    			}

    			video_updating = false;

    			if (dirty & /*paused*/ 4 && video_is_paused !== (video_is_paused = /*paused*/ ctx[2])) {
    				video[video_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*time, duration*/ 3 && progress_value_value !== (progress_value_value = /*time*/ ctx[0] / /*duration*/ ctx[1] || 0)) {
    				prop_dev(progress, "value", progress_value_value);
    			}

    			if (dirty & /*time*/ 1 && t2_value !== (t2_value = format(/*time*/ ctx[0]) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*paused*/ 4 && t5_value !== (t5_value = (/*paused*/ ctx[2] ? 'play' : 'pause') + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*duration*/ 2 && t8_value !== (t8_value = format(/*duration*/ ctx[1]) + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*duration, showControls*/ 10) {
    				set_style(div1, "opacity", /*duration*/ ctx[1] && /*showControls*/ ctx[3] ? 1 : 0);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format(seconds) {
    	if (isNaN(seconds)) return '...';
    	const minutes = Math.floor(seconds / 60);
    	seconds = Math.floor(seconds % 60);
    	if (seconds < 10) seconds = '0' + seconds;
    	return `${minutes}:${seconds}`;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	let time = 0;
    	let duration;
    	let paused = true;
    	let showControls = true;
    	let showControlsTimeout;

    	// Used to track time of last mouse down event
    	let lastMouseDown;

    	function handleMove(e) {
    		// Make the controls visible, but fade out after
    		// 2.5 seconds of inactivity
    		clearTimeout(showControlsTimeout);

    		showControlsTimeout = setTimeout(() => $$invalidate(3, showControls = false), 2500);
    		$$invalidate(3, showControls = true);
    		if (!duration) return; // video not loaded yet
    		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

    		const clientX = e.type === 'touchmove'
    		? e.touches[0].clientX
    		: e.clientX;

    		const { left, right } = this.getBoundingClientRect();
    		$$invalidate(0, time = duration * (clientX - left) / (right - left));
    	}

    	// we can't rely on the built-in click event, because it fires
    	// after a drag — we have to listen for clicks ourselves
    	function handleMousedown(e) {
    		lastMouseDown = new Date();
    	}

    	function handleMouseup(e) {
    		if (new Date() - lastMouseDown < 300) {
    			if (paused) e.target.play(); else e.target.pause();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	function video_timeupdate_handler() {
    		time = this.currentTime;
    		$$invalidate(0, time);
    	}

    	function video_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(1, duration);
    	}

    	function video_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(2, paused);
    	}

    	$$self.$capture_state = () => ({
    		time,
    		duration,
    		paused,
    		showControls,
    		showControlsTimeout,
    		lastMouseDown,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		format
    	});

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) $$invalidate(0, time = $$props.time);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('paused' in $$props) $$invalidate(2, paused = $$props.paused);
    		if ('showControls' in $$props) $$invalidate(3, showControls = $$props.showControls);
    		if ('showControlsTimeout' in $$props) showControlsTimeout = $$props.showControlsTimeout;
    		if ('lastMouseDown' in $$props) lastMouseDown = $$props.lastMouseDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		time,
    		duration,
    		paused,
    		showControls,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		video_timeupdate_handler,
    		video_durationchange_handler,
    		video_play_pause_handler
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let div2;
    	let div0;
    	let h10;
    	let t1;
    	let div1;
    	let h11;
    	let t3;
    	let div4;
    	let main;
    	let div3;
    	let player;
    	let t4;
    	let footer;
    	let current;
    	player = new Player({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Rothney Astrophysical Observatory";
    			t1 = space();
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Moonbroch";
    			t3 = space();
    			div4 = element("div");
    			main = element("main");
    			div3 = element("div");
    			create_component(player.$$.fragment);
    			t4 = space();
    			footer = element("footer");
    			attr_dev(h10, "class", "svelte-9zy6ic");
    			add_location(h10, file, 7, 16, 181);
    			attr_dev(div0, "class", "left svelte-9zy6ic");
    			add_location(div0, file, 6, 12, 146);
    			attr_dev(h11, "class", "svelte-9zy6ic");
    			add_location(h11, file, 11, 16, 312);
    			attr_dev(div1, "class", "right svelte-9zy6ic");
    			add_location(div1, file, 10, 12, 276);
    			attr_dev(div2, "class", "flex-container svelte-9zy6ic");
    			add_location(div2, file, 5, 8, 105);
    			attr_dev(header, "class", "svelte-9zy6ic");
    			add_location(header, file, 4, 4, 88);
    			attr_dev(div3, "class", "player");
    			add_location(div3, file, 17, 8, 485);
    			attr_dev(main, "class", "svelte-9zy6ic");
    			add_location(main, file, 16, 4, 470);
    			attr_dev(footer, "class", "svelte-9zy6ic");
    			add_location(footer, file, 22, 4, 560);
    			attr_dev(div4, "class", "grid-container svelte-9zy6ic");
    			add_location(div4, file, 15, 4, 436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h10);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h11);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, main);
    			append_dev(main, div3);
    			mount_component(player, div3, null);
    			append_dev(div4, t4);
    			append_dev(div4, footer);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div4);
    			destroy_component(player);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, Player });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world',
        },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
