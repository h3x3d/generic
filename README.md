# Generic #

Generic functions for js with namespace support

## Simple usage ##

```javascript

import { defgeneric, defmethod } from 'generic';

const a = { type: 'rect', w: 10, h: 20 };
const b = { type: 'circle', r: 10 };

const area = defgeneric(fig => fig.type);

defmethod(area, 'rect', fig => fig.w * fig.h);
defmethod(area, 'circle', fig => Math.PI * fig.r * fig.r);

area(a);
// => 200
area(b);
// => 314.159265359

```

TODO:
- implement implementation management methods
- Write tests