# FAQ (AKA questions I imagine people would ask me)

### Why vim?

This is a productivity tool, and I find vim productive (once you get past the learning curve).
Vim isn't for everyone, but if you edit text a lot, I recommend giving it a try.

### Why workflowy?

I like the tree of bullets format, and the lack of clutter.

### Why did you make Vimflowy?

I started working on Vimflowy after a conversation with a friend.
I'd seen many outlining apps, but the vim part was important to me.
My friend, who also uses vim keybindings for everything, had a *huge* document on Workflowy which was very laggy to load.
Vimflowy lazy loads, and deleting and pasting large subtrees is efficient, which went well with the vim concept.

So it started out being a tool mainly for me and my friend, but I do hope others also find it useful!
I've especially tried to make it so that developers can write plugins to customize it, without much trouble.
I would consider making a second set of non-vim bindings out of the box if enough people seem to like it.

### I do like this.  What else should I consider?

If you like both vim and workflowy, the best alternative I know of is spacemacs with the org layer (i.e. emacs org mode with vim keybindings).
Org mode is extremely powerful. I recommend trying it out.

There are pros and cons compared to vimflowy, which is more tailored for my particular workflow.
I'm curious how they compare for others, so if you try both, let me know what you think!

### Why doesn't *mumble* work like vim?

My goal is to make Vimflowy feel like home to vim users. However:
- Vim has a lot of commands, so there are some still missing.
- Vimflowy intentionally differs in few ways, partially due to its Workflowy-inspired half.
  Some known inconsistencies with vim are documented [here](vim_inconsistencies.md).

If you find that something is incongruous with your vim use, whether a bug or missing feature, let me know via a github issue. Or better yet, a pull request!
