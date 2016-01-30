# Generic #

Generic functions for js with namespace support

## Simple usage ##

```javascript

import {namespace, defgeneric, defmethod} from 'generic';

var a = {type: 'rect', w: 10, h: 20};
var b = {type: 'circle', r: 10};

let ns = namespace();

let area = defgeneric(ns, 'area', (fig) => fig.type);

defmethod(ns, 'area', 'rect', (fig) => fig.w * fig.h);
defmethod(ns, 'area', 'circle', (fig) => Math.PI * fig.r * fig.r);

area(a);
// => 200
area(b);
// => 314.159265359
```

TODO:
- Implement namespace as class, so we can inspect/remove/redefine implementations
- Write tests