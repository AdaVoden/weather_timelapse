
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    let intervalCheck = 120000; /* 2 minutes */
    const frameRate = writable(5);
    function getLatestFilename(url) {
        let result;
        const webReq = new XMLHttpRequest();
        webReq.open("GET", url, false);
        webReq.send(null);
        result = webReq.responseText;
        return result;
    }
    function latestImageFromURL(url) {
        return readable(getLatestFilename(url), function start(set) {
            const interval = setInterval(async () => {
                set(getLatestFilename(url));
            }, intervalCheck);
            return function stop() {
                clearInterval(interval);
            };
        });
    }
    function calculateTotalPlaytime(latestImage, frameRate, startTime) {
        const latestTime = parseFloat(latestImage);
        if (startTime > latestTime) {
            return 0;
        }
        const totalTime = latestTime - startTime;
        const minutes = Math.floor(totalTime % 60);
        const hours = Math.floor((totalTime - minutes) / 100);
        // divide by 100 to reduce to single/double digits of hours
        const totalImages = (hours * 30) + (minutes / 2);
        const playTime = totalImages / frameRate;
        return playTime;
    }
    function totalPlaytimeFromStores(latestImage, frameRate, startTime) {
        return derived([latestImage, frameRate], ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate, startTime));
    }

    /* src/Timelapse.svelte generated by Svelte v3.42.1 */

    const file$2 = "src/Timelapse.svelte";

    function create_fragment$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "draggable", "false");
    			if (!src_url_equal(img.src, img_src_value = /*$timelapse*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Timelapse");
    			add_location(img, file$2, 148, 0, 4491);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$timelapse*/ 8 && !src_url_equal(img.src, img_src_value = /*$timelapse*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function imageFilenameFromNumber(imageNumber) {
    	let filename = String(imageNumber);
    	return `${filename.padStart(4, "0")}.jpg`;
    }

    function clampImageNumber(num) {
    	num = roundToEven(num);
    	const digits = String(num).split('');

    	if (digits.length >= 2) {
    		digits.pop(); // get rid of single minutes
    		const tensOfMinutes = digits.pop();

    		if (parseInt(tensOfMinutes) >= 6) {
    			num -= 60;
    			num += 100;
    		}
    	}

    	if (num > 2400) {
    		// Reset just in case
    		num = 0;
    	}

    	return num;
    }

    function roundToEven(num) {
    	num = Math.floor(num); // No floats

    	if (num % 2 === 1) {
    		num = parseInt(num - 1);
    	}

    	return num;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $frameRate;

    	let $totalPlaytime,
    		$$unsubscribe_totalPlaytime = noop,
    		$$subscribe_totalPlaytime = () => ($$unsubscribe_totalPlaytime(), $$unsubscribe_totalPlaytime = subscribe(totalPlaytime, $$value => $$invalidate(10, $totalPlaytime = $$value)), totalPlaytime);

    	let $latestImage,
    		$$unsubscribe_latestImage = noop,
    		$$subscribe_latestImage = () => ($$unsubscribe_latestImage(), $$unsubscribe_latestImage = subscribe(latestImage, $$value => $$invalidate(11, $latestImage = $$value)), latestImage);

    	let $timelapse,
    		$$unsubscribe_timelapse = noop,
    		$$subscribe_timelapse = () => ($$unsubscribe_timelapse(), $$unsubscribe_timelapse = subscribe(timelapse, $$value => $$invalidate(3, $timelapse = $$value)), timelapse);

    	validate_store(frameRate, 'frameRate');
    	component_subscribe($$self, frameRate, $$value => $$invalidate(9, $frameRate = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_totalPlaytime());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_latestImage());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_timelapse());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timelapse', slots, []);
    	let { paused = true } = $$props;
    	let { time } = $$props;
    	let { allsky } = $$props;
    	let { totalPlaytime } = $$props;
    	validate_store(totalPlaytime, 'totalPlaytime');
    	$$subscribe_totalPlaytime();
    	let baseURL = "/images";
    	let allSkyFolder = "AllSkyCamImages";
    	let weatherFolder = "WeatherCamImages";
    	let url;
    	let playStartTime;
    	let latestImage;
    	let timelapse;
    	const millisecondsPerFrame = 1000 / $frameRate;
    	const secondsPerFrame = millisecondsPerFrame / 1000;

    	// Before mounting setup
    	if (allsky) {
    		playStartTime = 1200;
    		setupTimelapse(allSkyFolder, playStartTime);
    	} else {
    		playStartTime = 500;
    		setupTimelapse(weatherFolder, playStartTime);
    	}

    	function nextImageFilename(currentImage, latestImage) {
    		currentImage = currentImage.split("/").at(-1);
    		latestImage = latestImage.split("/").at(-1);

    		// Just in case we're passed in full URLs
    		currentImage = currentImage.split(".")[0];

    		latestImage = latestImage.split(".")[0];
    		let nextImage = parseInt(currentImage) + 2;
    		let latestImageNum = parseInt(latestImage);
    		nextImage = clampImageNumber(nextImage);

    		if (nextImage >= latestImageNum) {
    			// Never go past latest image
    			nextImage = latestImageNum;
    		}

    		let resultNumber = imageFilenameFromNumber(nextImage);
    		return `${url}${resultNumber}`;
    	}

    	function imageFilenameFromTime(time, frameRate) {
    		const currentFrame = time * frameRate;
    		const totalFrameMinutes = currentFrame * 2;
    		const hours = Math.floor(totalFrameMinutes / 60);
    		const minutes = Math.floor(totalFrameMinutes % 60);
    		const frameTime = hours * 100 + minutes;

    		// * 100 so it's in digit slot 3, or 3 and 4;
    		const imageTime = clampImageNumber(frameTime + playStartTime);

    		const imageFilename = imageFilenameFromNumber(imageTime);
    		return imageFilename;
    	}

    	function createTimelapse(startPoint) {
    		const { subscribe, set, update } = writable(url + startPoint);
    		let interval;

    		function play() {
    			interval = setInterval(
    				() => {
    					if (time < $totalPlaytime) {
    						update(n => nextImageFilename(n, $latestImage));
    						$$invalidate(4, time = time + secondsPerFrame);
    					}

    					
    				},
    				millisecondsPerFrame
    			);
    		}

    		function pause() {
    			clearInterval(interval);
    		}

    		function seek(time) {
    			if (time < 0) {
    				time = 0;
    			}

    			

    			if (time < $totalPlaytime) {
    				let seekTo = url + imageFilenameFromTime(time, $frameRate);
    				set(seekTo);
    			}
    		}

    		function resetStartPoint() {
    			pause();
    			let seekTo = url + imageFilenameFromNumber(playStartTime);
    			set(seekTo);
    		}

    		return {
    			subscribe,
    			play: () => play(),
    			pause: () => pause(),
    			seek: time => seek(time),
    			resetStartPoint: () => resetStartPoint()
    		};
    	}

    	function setupTimelapseVariables(imageFolder, startPoint) {
    		if (typeof timelapse !== 'undefined') {
    			timelapse.pause();
    		}

    		playStartTime = startPoint;
    		url = `${baseURL}/${imageFolder}/`;
    		$$subscribe_latestImage($$invalidate(2, latestImage = latestImageFromURL(url + "lastimage")));
    		$$subscribe_totalPlaytime($$invalidate(0, totalPlaytime = totalPlaytimeFromStores(latestImage, frameRate, startPoint)));
    		$$invalidate(4, time = 0);
    	}

    	function setupTimelapse(imageFolder, startPoint) {
    		setupTimelapseVariables(imageFolder, startPoint);
    		const startFilename = imageFilenameFromNumber(startPoint);
    		$$subscribe_timelapse($$invalidate(1, timelapse = createTimelapse(startFilename)));
    	}

    	const writable_props = ['paused', 'time', 'allsky', 'totalPlaytime'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timelapse> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('paused' in $$props) $$invalidate(5, paused = $$props.paused);
    		if ('time' in $$props) $$invalidate(4, time = $$props.time);
    		if ('allsky' in $$props) $$invalidate(6, allsky = $$props.allsky);
    		if ('totalPlaytime' in $$props) $$subscribe_totalPlaytime($$invalidate(0, totalPlaytime = $$props.totalPlaytime));
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		totalPlaytimeFromStores,
    		frameRate,
    		latestImageFromURL,
    		paused,
    		time,
    		allsky,
    		totalPlaytime,
    		baseURL,
    		allSkyFolder,
    		weatherFolder,
    		url,
    		playStartTime,
    		latestImage,
    		timelapse,
    		millisecondsPerFrame,
    		secondsPerFrame,
    		imageFilenameFromNumber,
    		nextImageFilename,
    		clampImageNumber,
    		roundToEven,
    		imageFilenameFromTime,
    		createTimelapse,
    		setupTimelapseVariables,
    		setupTimelapse,
    		$frameRate,
    		$totalPlaytime,
    		$latestImage,
    		$timelapse
    	});

    	$$self.$inject_state = $$props => {
    		if ('paused' in $$props) $$invalidate(5, paused = $$props.paused);
    		if ('time' in $$props) $$invalidate(4, time = $$props.time);
    		if ('allsky' in $$props) $$invalidate(6, allsky = $$props.allsky);
    		if ('totalPlaytime' in $$props) $$subscribe_totalPlaytime($$invalidate(0, totalPlaytime = $$props.totalPlaytime));
    		if ('baseURL' in $$props) baseURL = $$props.baseURL;
    		if ('allSkyFolder' in $$props) $$invalidate(13, allSkyFolder = $$props.allSkyFolder);
    		if ('weatherFolder' in $$props) $$invalidate(14, weatherFolder = $$props.weatherFolder);
    		if ('url' in $$props) url = $$props.url;
    		if ('playStartTime' in $$props) playStartTime = $$props.playStartTime;
    		if ('latestImage' in $$props) $$subscribe_latestImage($$invalidate(2, latestImage = $$props.latestImage));
    		if ('timelapse' in $$props) $$subscribe_timelapse($$invalidate(1, timelapse = $$props.timelapse));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*allsky, timelapse*/ 66) {
    			if (allsky) {
    				setupTimelapseVariables(allSkyFolder, 1200);
    				timelapse.resetStartPoint();
    			} else {
    				setupTimelapseVariables(weatherFolder, 500);
    				timelapse.resetStartPoint();
    			}
    		}

    		if ($$self.$$.dirty & /*paused, timelapse*/ 34) {
    			if (paused) {
    				timelapse.pause();
    			} else {
    				timelapse.play();
    			}
    		}

    		if ($$self.$$.dirty & /*timelapse, time*/ 18) {
    			timelapse.seek(time);
    		}
    	};

    	return [totalPlaytime, timelapse, latestImage, $timelapse, time, paused, allsky];
    }

    class Timelapse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			paused: 5,
    			time: 4,
    			allsky: 6,
    			totalPlaytime: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timelapse",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*time*/ ctx[4] === undefined && !('time' in props)) {
    			console.warn("<Timelapse> was created without expected prop 'time'");
    		}

    		if (/*allsky*/ ctx[6] === undefined && !('allsky' in props)) {
    			console.warn("<Timelapse> was created without expected prop 'allsky'");
    		}

    		if (/*totalPlaytime*/ ctx[0] === undefined && !('totalPlaytime' in props)) {
    			console.warn("<Timelapse> was created without expected prop 'totalPlaytime'");
    		}
    	}

    	get paused() {
    		throw new Error("<Timelapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paused(value) {
    		throw new Error("<Timelapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Timelapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Timelapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allsky() {
    		throw new Error("<Timelapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allsky(value) {
    		throw new Error("<Timelapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalPlaytime() {
    		throw new Error("<Timelapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalPlaytime(value) {
    		throw new Error("<Timelapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Player.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/Player.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let timelapse;
    	let updating_time;
    	let updating_totalPlaytime;
    	let t0;
    	let div1;
    	let div0;
    	let span0;
    	let t1_value = format(/*time*/ ctx[1]) + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3;
    	let t4_value = (/*paused*/ ctx[2] ? 'play' : 'pause') + "";
    	let t4;
    	let t5;
    	let t6;
    	let span2;
    	let t7_value = format(/*$duration*/ ctx[5]) + "";
    	let t7;
    	let t8;
    	let progress;
    	let progress_value_value;
    	let current;
    	let mounted;
    	let dispose;

    	function timelapse_time_binding(value) {
    		/*timelapse_time_binding*/ ctx[9](value);
    	}

    	function timelapse_totalPlaytime_binding(value) {
    		/*timelapse_totalPlaytime_binding*/ ctx[10](value);
    	}

    	let timelapse_props = {
    		paused: /*paused*/ ctx[2],
    		allsky: /*allsky*/ ctx[0]
    	};

    	if (/*time*/ ctx[1] !== void 0) {
    		timelapse_props.time = /*time*/ ctx[1];
    	}

    	if (/*duration*/ ctx[3] !== void 0) {
    		timelapse_props.totalPlaytime = /*duration*/ ctx[3];
    	}

    	timelapse = new Timelapse({ props: timelapse_props, $$inline: true });
    	binding_callbacks.push(() => bind(timelapse, 'time', timelapse_time_binding));
    	binding_callbacks.push(() => bind(timelapse, 'totalPlaytime', timelapse_totalPlaytime_binding));

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(timelapse.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text("click anywhere to ");
    			t4 = text(t4_value);
    			t5 = text(" / drag to seek");
    			t6 = space();
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			progress = element("progress");
    			attr_dev(span0, "class", "time svelte-pv6ez4");
    			add_location(span0, file$1, 69, 12, 2147);
    			attr_dev(span1, "class", "svelte-pv6ez4");
    			add_location(span1, file$1, 70, 12, 2200);
    			attr_dev(span2, "class", "time svelte-pv6ez4");
    			add_location(span2, file$1, 71, 12, 2286);
    			attr_dev(div0, "class", "info svelte-pv6ez4");
    			add_location(div0, file$1, 68, 8, 2116);
    			progress.value = progress_value_value = /*time*/ ctx[1] / /*$duration*/ ctx[5] || 0;
    			attr_dev(progress, "class", "svelte-pv6ez4");
    			add_location(progress, file$1, 74, 8, 2356);
    			attr_dev(div1, "class", "controls svelte-pv6ez4");
    			set_style(div1, "opacity", /*$duration*/ ctx[5] && /*showControls*/ ctx[4] ? 1 : 0);
    			add_location(div1, file$1, 66, 4, 2031);
    			attr_dev(div2, "class", "svelte-pv6ez4");
    			add_location(div2, file$1, 53, 0, 1591);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(timelapse, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(span1, t5);
    			append_dev(div0, t6);
    			append_dev(div0, span2);
    			append_dev(span2, t7);
    			append_dev(div1, t8);
    			append_dev(div1, progress);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "mousemove", /*handleMove*/ ctx[6], false, false, false),
    					listen_dev(div2, "touchmove", prevent_default(/*handleMove*/ ctx[6]), false, true, false),
    					listen_dev(div2, "mousedown", /*handleMousedown*/ ctx[7], false, false, false),
    					listen_dev(div2, "touchstart", prevent_default(/*handleMousedown*/ ctx[7]), false, true, false),
    					listen_dev(div2, "touchend", prevent_default(/*handleMouseup*/ ctx[8]), false, true, false),
    					listen_dev(div2, "mouseup", /*handleMouseup*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const timelapse_changes = {};
    			if (dirty & /*paused*/ 4) timelapse_changes.paused = /*paused*/ ctx[2];
    			if (dirty & /*allsky*/ 1) timelapse_changes.allsky = /*allsky*/ ctx[0];

    			if (!updating_time && dirty & /*time*/ 2) {
    				updating_time = true;
    				timelapse_changes.time = /*time*/ ctx[1];
    				add_flush_callback(() => updating_time = false);
    			}

    			if (!updating_totalPlaytime && dirty & /*duration*/ 8) {
    				updating_totalPlaytime = true;
    				timelapse_changes.totalPlaytime = /*duration*/ ctx[3];
    				add_flush_callback(() => updating_totalPlaytime = false);
    			}

    			timelapse.$set(timelapse_changes);
    			if ((!current || dirty & /*time*/ 2) && t1_value !== (t1_value = format(/*time*/ ctx[1]) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*paused*/ 4) && t4_value !== (t4_value = (/*paused*/ ctx[2] ? 'play' : 'pause') + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*$duration*/ 32) && t7_value !== (t7_value = format(/*$duration*/ ctx[5]) + "")) set_data_dev(t7, t7_value);

    			if (!current || dirty & /*time, $duration*/ 34 && progress_value_value !== (progress_value_value = /*time*/ ctx[1] / /*$duration*/ ctx[5] || 0)) {
    				prop_dev(progress, "value", progress_value_value);
    			}

    			if (!current || dirty & /*$duration, showControls*/ 48) {
    				set_style(div1, "opacity", /*$duration*/ ctx[5] && /*showControls*/ ctx[4] ? 1 : 0);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timelapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timelapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(timelapse);
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
    	let $duration,
    		$$unsubscribe_duration = noop,
    		$$subscribe_duration = () => ($$unsubscribe_duration(), $$unsubscribe_duration = subscribe(duration, $$value => $$invalidate(5, $duration = $$value)), duration);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_duration());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	let { allsky = false } = $$props;
    	let time = 0;
    	let paused = true;
    	let duration;
    	let showControls = true;
    	let showControlsTimeout;

    	// Used to track time of last mouse down event
    	let lastMouseDown;

    	function handleMove(e) {
    		// Make the controls visible, but fade out after
    		// 2.5 seconds of inactivity
    		clearTimeout(showControlsTimeout);

    		showControlsTimeout = setTimeout(() => $$invalidate(4, showControls = false), 2500);
    		$$invalidate(4, showControls = true);
    		if (!duration) return; // video not loaded yet
    		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

    		const clientX = e.type === 'touchmove'
    		? e.touches[0].clientX
    		: e.clientX;

    		const { left, right } = this.getBoundingClientRect();
    		$$invalidate(1, time = $duration * (clientX - left) / (right - left));
    	}

    	// we can't rely on the built-in click event, because it fires
    	// after a drag — we have to listen for clicks ourselves
    	function handleMousedown(e) {
    		lastMouseDown = new Date();
    	}

    	function handleMouseup(e) {
    		// TODO handle distance dragged
    		if (new Date() - lastMouseDown < 300) {
    			//Play on click
    			if (paused) {
    				$$invalidate(2, paused = false);
    			} else {
    				$$invalidate(2, paused = true);
    			}

    			
    		}
    	}

    	const writable_props = ['allsky'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	function timelapse_time_binding(value) {
    		time = value;
    		$$invalidate(1, time);
    	}

    	function timelapse_totalPlaytime_binding(value) {
    		duration = value;
    		$$subscribe_duration($$invalidate(3, duration));
    	}

    	$$self.$$set = $$props => {
    		if ('allsky' in $$props) $$invalidate(0, allsky = $$props.allsky);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		Timelapse,
    		allsky,
    		time,
    		paused,
    		duration,
    		showControls,
    		showControlsTimeout,
    		lastMouseDown,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		format,
    		$duration
    	});

    	$$self.$inject_state = $$props => {
    		if ('allsky' in $$props) $$invalidate(0, allsky = $$props.allsky);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('paused' in $$props) $$invalidate(2, paused = $$props.paused);
    		if ('duration' in $$props) $$subscribe_duration($$invalidate(3, duration = $$props.duration));
    		if ('showControls' in $$props) $$invalidate(4, showControls = $$props.showControls);
    		if ('showControlsTimeout' in $$props) showControlsTimeout = $$props.showControlsTimeout;
    		if ('lastMouseDown' in $$props) lastMouseDown = $$props.lastMouseDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		allsky,
    		time,
    		paused,
    		duration,
    		showControls,
    		$duration,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		timelapse_time_binding,
    		timelapse_totalPlaytime_binding
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { allsky: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get allsky() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allsky(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t1_value = (/*toggle*/ ctx[0] ? "AllSky" : "Weather") + "";
    	let t1;
    	let t2;
    	let t3;
    	let main;
    	let div2;
    	let player;
    	let t4;
    	let input;
    	let t5;
    	let label;
    	let h2;
    	let t6_value = (/*toggle*/ ctx[0] ? "AllSkyCam" : "WeatherCam") + "";
    	let t6;
    	let h2_class_value;
    	let label_class_value;
    	let t7;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;

    	player = new Player({
    			props: { allsky: /*toggle*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = text(" Timelapse");
    			t3 = space();
    			main = element("main");
    			div2 = element("div");
    			create_component(player.$$.fragment);
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			label = element("label");
    			h2 = element("h2");
    			t6 = text(t6_value);
    			t7 = space();
    			footer = element("footer");
    			if (!src_url_equal(img.src, img_src_value = "./uc-rothney.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "header-img");
    			add_location(img, file, 9, 8, 212);
    			attr_dev(div0, "class", "left");
    			add_location(div0, file, 8, 4, 185);
    			add_location(h1, file, 13, 8, 326);
    			attr_dev(div1, "class", "right");
    			add_location(div1, file, 12, 4, 298);
    			attr_dev(header, "class", "flex-container row");
    			add_location(header, file, 7, 0, 145);
    			attr_dev(div2, "class", "player");
    			add_location(div2, file, 19, 4, 491);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "allsky");
    			attr_dev(input, "id", "allsky");
    			attr_dev(input, "class", "svelte-y8xbaa");
    			add_location(input, file, 23, 4, 563);
    			attr_dev(h2, "class", h2_class_value = "" + (null_to_empty(/*toggle*/ ctx[0] ? "text-left" : "text-right") + " svelte-y8xbaa"));
    			add_location(h2, file, 25, 8, 717);
    			attr_dev(label, "for", "allsky");
    			attr_dev(label, "class", label_class_value = " " + (/*toggle*/ ctx[0] ? "flex-left" : "flex-right") + " svelte-y8xbaa");
    			add_location(label, file, 24, 4, 641);
    			attr_dev(main, "class", "flex-container column");
    			add_location(main, file, 18, 0, 450);
    			add_location(footer, file, 32, 0, 855);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, img);
    			append_dev(header, t0);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			mount_component(player, div2, null);
    			append_dev(main, t4);
    			append_dev(main, input);
    			input.checked = /*toggle*/ ctx[0];
    			append_dev(main, t5);
    			append_dev(main, label);
    			append_dev(label, h2);
    			append_dev(h2, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, footer, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*toggle*/ 1) && t1_value !== (t1_value = (/*toggle*/ ctx[0] ? "AllSky" : "Weather") + "")) set_data_dev(t1, t1_value);
    			const player_changes = {};
    			if (dirty & /*toggle*/ 1) player_changes.allsky = /*toggle*/ ctx[0];
    			player.$set(player_changes);

    			if (dirty & /*toggle*/ 1) {
    				input.checked = /*toggle*/ ctx[0];
    			}

    			if ((!current || dirty & /*toggle*/ 1) && t6_value !== (t6_value = (/*toggle*/ ctx[0] ? "AllSkyCam" : "WeatherCam") + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*toggle*/ 1 && h2_class_value !== (h2_class_value = "" + (null_to_empty(/*toggle*/ ctx[0] ? "text-left" : "text-right") + " svelte-y8xbaa"))) {
    				attr_dev(h2, "class", h2_class_value);
    			}

    			if (!current || dirty & /*toggle*/ 1 && label_class_value !== (label_class_value = " " + (/*toggle*/ ctx[0] ? "flex-left" : "flex-right") + " svelte-y8xbaa")) {
    				attr_dev(label, "class", label_class_value);
    			}
    		},
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
    			if (detaching) detach_dev(main);
    			destroy_component(player);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
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
    	let toggle = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		toggle = this.checked;
    		$$invalidate(0, toggle);
    	}

    	$$self.$capture_state = () => ({ Player, toggle });

    	$$self.$inject_state = $$props => {
    		if ('toggle' in $$props) $$invalidate(0, toggle = $$props.toggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggle, input_change_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

}());
