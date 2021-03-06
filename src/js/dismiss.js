import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

const RbpDismiss = (($d, core, base) => {

    const defaults = { hint: "Click to close", target: "" };
    class RbpDismiss extends base {
        constructor(element, options) {
            super(element, defaults, options, "dismiss");

            this.eDismiss = "dismiss.rbp";
            this.eDismissed = "dismissed.rbp";
            this.dismissing = false;
            this.target = this.element.closest(this.options.target);

            // A11y 
            $d.setAttr(this.element, { "type": "button" });
            if (this.target.classList.contains("alert")) {
                $d.setAttr(this.target, { "role": "alert" });
            }

            if (!$d.queryAll(".visuallyhidden", this.element).length) {
                let span = $d.create("span");
                $d.addClass(span, "visuallyhidden");
                span.innerHTML = this.options.hint;
                this.element.appendChild(span);
            }

            $d.on(this.element, "click", null, this.click.bind(this));
        }

        close() {
            if (this.dismissing || !$d.trigger(this.element, this.eDismiss)) {
                return;
            }

            this.dismissing = true;

            const complete = () => {
                $d.removeClass(this.target, "fade-out");
                $d.setAttr(this.target, { "aria-hidden": true, "hidden": true, "tabindex": -1 });
                $d.trigger(this.element, this.eDismissed);
            };

            $d.addClass(this.target, "fade-in fade-out");
            core.onTransitionEnd(this.target, complete);
            core.redraw(this.target);
            $d.removeClass(this.target, "fade-in");
        }

        click(event) {
            event.preventDefault();
            this.close();
        }
    }

    // Register plugin and data-api event handler
    core.fn.dismiss = (e, o) => $d.queryAll(e).forEach(i => core.data(i).dismiss || (core.data(i).dismiss = new RbpDismiss(i, o)));
    core.fn.on["dismiss.data-api"] = $d.on(document, core.einit, null, () => {
        core.fn.dismiss("[data-dismiss-target]");
    });

    $d.ready().then(() => { $d.trigger(document, core.einit); });

    return RbpDismiss;

})($d, RbpCore, RbpBase);

export default RbpDismiss;