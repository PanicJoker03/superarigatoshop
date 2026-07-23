import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

interface Point2 {
  x:number,
  y:number
}

@Directive({
  selector: '[ElementSwap]',
})
export class SwapDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly swipeLeft = output<void>();
  readonly swipeRight = output<void>();

  private touchStart: Point2 = { x: 0, y: 0 };
  private touchEnd: Point2 = { x: 0, y: 0 };

  private readonly threshold = 50; // min px distance to count as swipe
  private readonly restraint = 100; // max vertical distance drift allowed

  constructor() {
    const element = this.el.nativeElement;

    const onTouchStart = (e: TouchEvent) => {
      this.touchStart.x = e.changedTouches[0].screenX;
      this.touchStart.y = e.changedTouches[0].screenY;
    }

    const onTouchEnd = (e: TouchEvent) => {
      this.touchEnd.x = e.changedTouches[0].screenX;
      this.touchEnd.y = e.changedTouches[0].screenY;
      this.handleSwipe();
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    this.destroyRef.onDestroy(()=>{
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
    });
  }

  private handleSwipe(){
    console.log("handling swipe");
    const delta:Point2 = {
      x : this.touchEnd.x - this.touchStart.x,
      y : Math.abs(this.touchEnd.y - this.touchStart.y)
    }

    if(delta.y > this.restraint)
      return;

    if(delta.x <= -this.threshold){
      this.swipeLeft.emit(); // moved right → left
    }
    else if (delta.x >= this.threshold){
      this.swipeRight.emit(); //finger moved left → right
    }
  }
}
